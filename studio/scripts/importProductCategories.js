import {createClient} from '@sanity/client'
import * as dotenv from 'dotenv'
import {fileURLToPath} from 'url'
import {dirname, resolve} from 'path'
import {createReadStream} from 'fs'
import {parse} from 'csv-parse'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({path: resolve(__dirname, '../.env')})

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_STUDIO_TOKEN,
})

const CSV_FILE = resolve(__dirname, '../imports/allproducts04.csv')

// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Find or create category
async function findOrCreateCategory(title, categoryType, parentRef = null) {
  if (!title || !title.trim()) return null

  const slug = generateSlug(title)
  
  // Check if category already exists
  const existing = await client.fetch(
    `*[_type == $categoryType && slug.current == $slug][0] {
      _id,
      title,
      slug,
      parentType
    }`,
    {categoryType, slug}
  )

  if (existing) {
    // If it exists, check if we need to update the parentType
    if (parentRef && !existing.parentType) {
      console.log(`   ⬆️  Updating ${categoryType} "${title}" with parentType`)
      await client
        .patch(existing._id)
        .set({parentType: {_type: 'reference', _ref: parentRef}})
        .commit()
      
      return {...existing, parentType: {_ref: parentRef}}
    }
    return existing
  }

  // Create new category
  console.log(`   Creating new ${categoryType}: "${title}"${parentRef ? ' (with parent)' : ''}`)
  
  const doc = {
    _type: categoryType,
    title: title.trim(),
    slug: {
      _type: 'slug',
      current: slug,
    },
  }

  if (parentRef) {
    doc.parentType = {
      _type: 'reference',
      _ref: parentRef,
    }
  }

  const created = await client.create(doc)
  return created
}

// Process CSV and update products
async function importProductCategories() {
  console.log('🚀 Starting product categories import...\n')

  const records = []
  
  // Read CSV file
  const parser = createReadStream(CSV_FILE).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })
  )

  for await (const record of parser) {
    records.push(record)
  }

  console.log(`📄 Found ${records.length} records in CSV\n`)

  let processedCount = 0
  let skippedCount = 0
  let updatedCount = 0

  for (const record of records) {
    const handle = record['Handle']
    const category = record['category']
    const mainType = record['type']     // Main type (e.g., "Table")
    const subType = record['subType']   // Subtype (e.g., "Occasional Table")

    // Skip if no handle or no category
    if (!handle || !category || (!mainType && !subType)) {
      skippedCount++
      continue
    }

    console.log(`\n${'='.repeat(60)}`)
    console.log(`Processing: ${handle}`)
    console.log(`Category: ${category} | Main Type: ${mainType || 'N/A'} | SubType: ${subType || 'N/A'}`)
    console.log(`${'='.repeat(60)}`)

    // Find product by handle (slug)
    const product = await client.fetch(
      `*[_type == "product" && store.slug.current == $handle][0] {
        _id,
        "title": store.title,
        "slug": store.slug.current,
        category,
        objectsCategory,
        objectsSubtype,
        furnitureCategory,
        furnitureSubtype
      }`,
      {handle}
    )

    if (!product) {
      console.log(`⚠️  Product not found for handle: ${handle}`)
      skippedCount++
      continue
    }

    console.log(`✅ Found product: ${product.title}`)
    
    const updates = {}
    let hasUpdates = false

    // Set category field if not already set
    if (!product.category && category) {
      const normalizedCategory = category.toLowerCase()
      if (normalizedCategory === 'furniture' || normalizedCategory === 'objects') {
        updates.category = normalizedCategory
        hasUpdates = true
        console.log(`   📁 Setting category: ${normalizedCategory}`)
      }
    }

    // Determine which category type to use
    const categoryType = (product.category || category).toLowerCase() === 'objects' 
      ? 'objectsCategory' 
      : 'furnitureCategory'
    
    const subtypeField = categoryType === 'objectsCategory' 
      ? 'objectsSubtype' 
      : 'furnitureSubtype'

    // Handle case where only subType exists or when mainType equals subType
    let effectiveMainType = mainType
    let effectiveSubType = subType
    
    if (!mainType && subType) {
      // If only subType exists, treat it as main type
      effectiveMainType = subType
      effectiveSubType = null
      console.log(`   ⚠️  Only subType found, treating "${subType}" as main type`)
    } else if (mainType && subType && mainType === subType) {
      // If mainType and subType are the same, only use mainType
      effectiveSubType = null
      console.log(`   ⚠️  Type and Subtype are the same ("${mainType}"), only using as main type`)
    }

    // Track fields to unset
    const fieldsToUnset = []
    
    // Process mainType (parent category)
    let mainTypeRef = null
    if (effectiveMainType && effectiveMainType.trim()) {
      const mainTypeCategory = await findOrCreateCategory(effectiveMainType, categoryType)
      if (mainTypeCategory) {
        mainTypeRef = mainTypeCategory._id
        
        // Always set the main type
        updates[categoryType] = {
          _type: 'reference',
          _ref: mainTypeRef,
        }
        hasUpdates = true
        console.log(`   🔗 Linking ${categoryType}: ${effectiveMainType}`)
      }
    } else if (product[categoryType]) {
      // Clear if no mainType but field exists
      fieldsToUnset.push(categoryType)
      console.log(`   🗑️  Clearing ${categoryType}`)
    }

    // Process subType (child category with parent reference)
    // Only process subtype if we have both effectiveSubType AND mainTypeRef
    if (effectiveSubType && effectiveSubType.trim() && mainTypeRef) {
      // Create subtype with parent reference
      const subtypeCategory = await findOrCreateCategory(effectiveSubType, categoryType, mainTypeRef)
      if (subtypeCategory) {
        const currentSubtypeRef = product[subtypeField]?._ref
        if (currentSubtypeRef !== subtypeCategory._id) {
          updates[subtypeField] = {
            _type: 'reference',
            _ref: subtypeCategory._id,
          }
          hasUpdates = true
          console.log(`   🔗 Linking ${subtypeField}: ${effectiveSubType}`)
        }
      }
    }

    // Update product if there are changes
    if (hasUpdates || fieldsToUnset.length > 0) {
      try {
        const patch = client.patch(product._id)
        
        // Apply unset operations first to clear old values
        if (fieldsToUnset.length > 0) {
          patch.unset(fieldsToUnset)
        }
        
        // Apply set operations to add new values
        if (Object.keys(updates).length > 0) {
          patch.set(updates)
        }
        
        await patch.commit()
        
        console.log(`✅ Updated product: ${product.title}`)
        updatedCount++
      } catch (error) {
        console.error(`❌ Error updating product ${product.title}:`, error.message)
      }
    } else {
      console.log(`ℹ️  No updates needed for ${product.title}`)
    }

    processedCount++
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 Import Summary')
  console.log('='.repeat(60))
  console.log(`Total records in CSV: ${records.length}`)
  console.log(`Processed: ${processedCount}`)
  console.log(`Updated: ${updatedCount}`)
  console.log(`Skipped: ${skippedCount}`)
  console.log('='.repeat(60))
}

importProductCategories().catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})
