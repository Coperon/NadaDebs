import {createClient} from '@sanity/client'
import * as dotenv from 'dotenv'
import {fileURLToPath} from 'url'
import {dirname, resolve} from 'path'
import {createReadStream} from 'fs'
import {parse} from 'csv-parse'
import fs from 'fs'

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

const IMAGES_DIR = resolve(__dirname, '../imports/images')
const CSV_FILE = resolve(__dirname, '../imports/Nada Debs - Product Sheet - Sanity products (1).csv')

// Find existing image by filename
async function findExistingImage(filename) {
  const assets = await client.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename][0] {
      _id
    }`,
    {filename}
  )
  return assets
}

// Upload image to Sanity or return existing
async function uploadImage(imagePath, imageName) {
  try {
    const filename = imagePath.split('/').pop()
    
    // Check if image already exists
    const existing = await findExistingImage(filename)
    
    if (existing) {
      return {
        _type: 'image',
        _key: imageName.replace(/[^a-zA-Z0-9]/g, '_'),
        asset: {
          _type: 'reference',
          _ref: existing._id,
        },
      }
    }
    
    // Upload new image if not exists
    const imageBuffer = fs.readFileSync(imagePath)
    const asset = await client.assets.upload('image', imageBuffer, {
      filename: filename,
    })
    return {
      _type: 'image',
      _key: imageName.replace(/[^a-zA-Z0-9]/g, '_'),
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    }
  } catch (error) {
    console.error(`❌ Error uploading image ${imagePath}:`, error.message)
    return null
  }
}

// Process CSV and update variants
async function importVariantData() {
  console.log('🚀 Starting variant data import...\n')

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
    const sku = record['Ref']
    const gallery = record['Gallery']
    const metaFieldDesc = record['Meta field 1 desc']

    // Skip if no SKU or SKU is "No"
    if (!sku || sku === 'No' || sku === '#N/A') {
      skippedCount++
      continue
    }

    console.log(`\n${'='.repeat(60)}`)
    console.log(`Processing SKU: ${sku}`)
    console.log(`${'='.repeat(60)}`)

    // Find variant by SKU
    const variant = await client.fetch(
      `*[_type == "productVariant" && store.sku == $sku][0] {
        _id,
        "title": store.title,
        "sku": store.sku,
        images,
        metaFields
      }`,
      {sku}
    )

    if (!variant) {
      console.log(`⚠️  Variant not found for SKU: ${sku}`)
      skippedCount++
      continue
    }

    console.log(`✅ Found variant: ${variant.title || variant.sku}`)
    
    const updates = {}
    let hasUpdates = false

    // Skip images and metaFields for "Default Title" variants
    // Remove them if they exist
    if (variant.title === 'Default Title') {
      console.log(`ℹ️  Skipping "Default Title" variant - data will be on product`)
      
      // Remove images and metaFields if they exist
      if (variant.images && variant.images.length > 0) {
        updates.images = []
        hasUpdates = true
        console.log(`   🗑️  Removing ${variant.images.length} existing images`)
      }
      
      if (variant.metaFields && variant.metaFields.length > 0) {
        updates.metaFields = []
        hasUpdates = true
        console.log(`   🗑️  Removing existing metaFields`)
      }
      
      // Skip to update if needed
      if (hasUpdates) {
        try {
          await client
            .patch(variant._id)
            .set(updates)
            .commit()
          
          console.log(`✅ Cleaned variant: ${variant.sku}`)
          updatedCount++
        } catch (error) {
          console.error(`❌ Error updating variant ${variant.sku}:`, error.message)
        }
      }
      
      processedCount++
      continue
    }

    // Process Gallery images
    if (gallery && gallery.trim()) {
      console.log(`📸 Processing gallery images...`)
      const imageNames = gallery
        .split(';')
        .map((name) => name.trim())
        .filter((name) => name)

      const uploadedImages = []
      
      for (const imageName of imageNames) {
        const imageFileName = `${imageName}.webp`
        const imagePath = resolve(IMAGES_DIR, imageFileName)
        
        if (fs.existsSync(imagePath)) {
          console.log(`   Processing: ${imageFileName}`)
          const imageRef = await uploadImage(imagePath, imageName)
          if (imageRef) {
            uploadedImages.push(imageRef)
          }
        } else {
          console.log(`   ⚠️  Image not found: ${imageFileName}`)
        }
      }

      if (uploadedImages.length > 0) {
        updates.images = uploadedImages
        hasUpdates = true
        console.log(`   ✅ Uploaded ${uploadedImages.length} images`)
      }
    }

    // Process Meta fields
    const metaFields = []
    
    if (metaFieldDesc && metaFieldDesc.trim()) {
      console.log(`📝 Adding meta field: Dimensions`)
      metaFields.push({
        _type: 'object',
        _key: 'dimensions',
        title: 'Dimensions',
        description: metaFieldDesc.trim(),
      })
    }

    const materialDesc = record['Meta field 2 desc']?.trim()
    if (materialDesc) {
      console.log(`📝 Adding meta field: Material`)
      metaFields.push({
        _type: 'object',
        _key: 'material',
        title: 'Material',
        description: materialDesc,
      })
    }

    if (metaFields.length > 0) {
      updates.metaFields = metaFields
      hasUpdates = true
    }

    // Update variant if there are changes
    if (hasUpdates) {
      try {
        await client
          .patch(variant._id)
          .set(updates)
          .commit()
        
        console.log(`✅ Updated variant: ${variant.sku}`)
        updatedCount++
      } catch (error) {
        console.error(`❌ Error updating variant ${variant.sku}:`, error.message)
      }
    } else {
      console.log(`ℹ️  No updates needed for ${variant.sku}`)
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

importVariantData().catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})
