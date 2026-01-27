import { createClient } from '@sanity/client'
import { parse } from 'csv-parse/sync'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import https from 'https'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Initialize Sanity client
const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,
  token: process.env.SANITY_STUDIO_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// Function to find existing image by URL
async function findExistingImageByUrl(imageUrl) {
  const query = `*[_type == "sanity.imageAsset" && url == $url][0]`
  return await client.fetch(query, { url: imageUrl })
}

// Function to upload image from URL
async function uploadImageFromUrl(imageUrl) {
  try {
    if (!imageUrl || imageUrl.trim() === '') {
      return null
    }

    // Check if image already exists
    const existingImage = await findExistingImageByUrl(imageUrl)
    if (existingImage) {
      console.log(`  ✓ Featured image already exists`)
      return {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: existingImage._id,
        },
      }
    }

    // Fetch image from URL using https
    const buffer = await new Promise((resolve, reject) => {
      https.get(imageUrl, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to fetch image: ${response.statusCode}`))
          return
        }
        const chunks = []
        response.on('data', (chunk) => chunks.push(chunk))
        response.on('end', () => resolve(Buffer.concat(chunks)))
        response.on('error', reject)
      }).on('error', reject)
    })

    const filename = imageUrl.split('/').pop().split('?')[0]

    // Upload to Sanity
    const asset = await client.assets.upload('image', buffer, {
      filename: filename,
    })

    console.log(`  ✓ Uploaded featured image: ${filename}`)

    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    }
  } catch (error) {
    console.error(`  ✗ Error uploading image:`, error.message)
    return null
  }
}

// Function to find craft by title
async function findCraftByTitle(craftTitle) {
  const query = `*[_type == "craft" && title == $title][0] { _id, title }`
  return await client.fetch(query, { title: craftTitle.trim() })
}

// Function to process craft references
async function processCrafts(craftString) {
  if (!craftString || craftString.trim() === '') {
    return []
  }

  const craftNames = craftString
    .split(',')
    .map((name) => name.trim())
    .filter((name) => name !== '')

  const craftReferences = []

  for (const craftName of craftNames) {
    const craft = await findCraftByTitle(craftName)
    if (craft) {
      craftReferences.push({
        _type: 'reference',
        _ref: craft._id,
        _key: craft._id,
      })
      console.log(`  ✓ Found craft: ${craftName}`)
    } else {
      console.log(`  ⚠ Craft not found: ${craftName}`)
    }
  }

  return craftReferences
}

async function main() {
  try {
    // Read CSV file
    const csvPath = path.join(__dirname, '../imports/allproductsfinal_with_description_and_category.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf-8')

    // Parse CSV
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })

    console.log(`Found ${records.length} records in CSV\n`)

    let processedCount = 0
    let skippedCount = 0
    let notFoundCount = 0

    for (const [index, row] of records.entries()) {
      const productName = row['Product']?.trim()

      if (!productName) {
        console.log(`Row ${index + 1}: No product name found, skipping`)
        skippedCount++
        continue
      }

      console.log(`\nProcessing ${index + 1}/${records.length}: ${productName}`)

      // Find product by title
      const productQuery = `*[_type == "product" && store.title == $title][0] {
        _id,
        store { title },
        isPersonalizable,
        crafts,
        description,
        featuredImage,
        category
      }`

      const product = await client.fetch(productQuery, { title: productName })

      if (!product) {
        console.log(`  ⚠ Product not found: ${productName}`)
        notFoundCount++
        continue
      }

      console.log(`  ✓ Found product: ${product.store?.title}`)

      // Build update object
      const updateData = {}
      let hasUpdates = false

      // Process isPersonalizable
      const isPersonalizable = row['IsPersonalizable']?.trim() === 'Yes'
      if (isPersonalizable !== product.isPersonalizable) {
        updateData.isPersonalizable = isPersonalizable
        hasUpdates = true
        console.log(`  ✓ Setting isPersonalizable: ${isPersonalizable}`)
      }

      // Process crafts
      const craftString = row['Craft']?.trim()
      const crafts = await processCrafts(craftString || '')

      // Check if crafts need updating
      const currentCraftIds = (product.crafts || []).map(c => c._ref).sort()
      const newCraftIds = crafts.map(c => c._ref).sort()
      const craftsChanged = JSON.stringify(currentCraftIds) !== JSON.stringify(newCraftIds)
      
      if (craftsChanged) {
        updateData.crafts = crafts
        hasUpdates = true
        if (crafts.length > 0) {
          console.log(`  ✓ Adding ${crafts.length} craft references`)
        } else {
          console.log(`  ✓ Clearing crafts`)
        }
      }

      // Process description
      const description = row['Description']?.trim() || ''
      if (description && description !== (product.description || '')) {
        updateData.description = description
        hasUpdates = true
        console.log(`  ✓ Setting description`)
      } else if (!description && product.description) {
        // Clear description if CSV has empty value but product has one
        updateData.description = ''
        hasUpdates = true
        console.log(`  ✓ Clearing description`)
      }

      // Process category
      const category = row['Category']?.trim().toLowerCase() || ''
      if (category) {
        // Only update if different or not set
        if (product.category !== category) {
          updateData.category = category
          hasUpdates = true
          console.log(`  ✓ Setting category: ${category}`)
        }
      } else if (product.category) {
        // If CSV is empty but product has a category, clear it
        updateData.category = ''
        hasUpdates = true
        console.log(`  ✓ Clearing category`)
      }

      // Process featured image
      const imageUrl = row['Image Src']?.trim() || ''
      if (imageUrl && !product.featuredImage) {
        const featuredImage = await uploadImageFromUrl(imageUrl)
        if (featuredImage) {
          updateData.featuredImage = featuredImage
          hasUpdates = true
          console.log(`  ✓ Setting featured image`)
        }
      }

      if (!hasUpdates) {
        console.log(`   No updates needed`)
        skippedCount++
        continue
      }

      // Update product
      await client
        .patch(product._id)
        .set(updateData)
        .commit()

      console.log(`  ✓ Updated product successfully`)
      processedCount++
    }

    console.log(`\n${'='.repeat(50)}`)
    console.log(`Import completed!`)
    console.log(`Total records: ${records.length}`)
    console.log(`Products updated: ${processedCount}`)
    console.log(`Skipped: ${skippedCount}`)
    console.log(`Not found: ${notFoundCount}`)
    console.log(`${'='.repeat(50)}`)
  } catch (error) {
    console.error('Error during import:', error)
    process.exit(1)
  }
}

main()
