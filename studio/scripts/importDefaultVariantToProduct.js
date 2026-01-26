import { createClient } from '@sanity/client'
import { parse } from 'csv-parse/sync'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

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

// Function to find existing image by filename
async function findExistingImage(filename) {
  const query = `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]`
  const params = { filename }
  return await client.fetch(query, params)
}

// Function to upload image and return image object
async function uploadImage(imageName, imagePath) {
  try {
    // Check if image already exists
    const existingImage = await findExistingImage(imageName)
    if (existingImage) {
      console.log(`  ✓ Image already exists: ${imageName}`)
      return {
        _type: 'image',
        _key: imageName.replace(/[^a-zA-Z0-9]/g, '_'),
        asset: {
          _type: 'reference',
          _ref: existingImage._id,
        },
      }
    }

    // Upload new image
    const imageBuffer = fs.readFileSync(imagePath)
    const asset = await client.assets.upload('image', imageBuffer, {
      filename: imageName,
    })

    console.log(`  ✓ Uploaded: ${imageName}`)

    return {
      _type: 'image',
      _key: imageName.replace(/[^a-zA-Z0-9]/g, '_'),
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    }
  } catch (error) {
    console.error(`  ✗ Error uploading ${imageName}:`, error.message)
    return null
  }
}

// Function to process gallery images
async function processGalleryImages(galleryString, imagesDir, dryRun = true) {
  if (!galleryString || galleryString.trim() === '') {
    return []
  }

  // Split by semicolon and clean up
  const imageNames = galleryString
    .split(';')
    .map((name) => name.trim())
    .filter((name) => name !== '')

  const imageObjects = []

  for (const imageName of imageNames) {
    const imageWithExt = `${imageName}.webp`
    const imagePath = path.join(imagesDir, imageWithExt)

    if (!fs.existsSync(imagePath)) {
      console.log(`  ⚠ Image not found: ${imageWithExt}`)
      continue
    }

    if (dryRun) {
      // Just count, don't upload
      imageObjects.push({ _type: 'image', _key: 'placeholder' })
      console.log(`  ✓ Would process: ${imageWithExt}`)
    } else {
      const imageObj = await uploadImage(imageWithExt, imagePath)
      if (imageObj) {
        imageObjects.push(imageObj)
      }
    }
  }

  return imageObjects
}

// Function to process meta fields from CSV
function processMetaFields(row) {
  const metaFields = []

  // Add Dimensions field if Meta field 1 desc has content
  const dimensionsDesc = row['Meta field 1 desc']?.trim()
  if (dimensionsDesc) {
    metaFields.push({
      _type: 'object',
      _key: `dimensions_${Date.now()}`,
      title: 'Dimensions',
      description: dimensionsDesc,
    })
  }

  // Add Material field if Meta field 2 desc has content
  const materialDesc = row['Meta field 2 desc']?.trim()
  if (materialDesc) {
    metaFields.push({
      _type: 'object',
      _key: `material_${Date.now()}`,
      title: 'Material',
      description: materialDesc,
    })
  }

  return metaFields
}

async function main() {
  try {
    // Read CSV file
    const csvPath = path.join(__dirname, '../imports/Nada Debs - Product Sheet - Sanity products (1).csv')
    const csvContent = fs.readFileSync(csvPath, 'utf-8')

    // Parse CSV
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })

    console.log(`Found ${records.length} records in CSV\n`)

    const imagesDir = path.join(__dirname, '../imports/images')

    let processedCount = 0
    let skippedCount = 0
    let notFoundCount = 0

    for (const [index, row] of records.entries()) {
      const sku = row['Ref']?.trim()

      if (!sku) {
        console.log(`Row ${index + 1}: No SKU found, skipping`)
        skippedCount++
        continue
      }

      console.log(`\nProcessing ${index + 1}/${records.length}: SKU ${sku}`)

      // Find variant by SKU
      const variantQuery = `*[_type == "productVariant" && store.sku == $sku][0] {
        _id,
        store {
          title,
          productId
        }
      }`

      const variant = await client.fetch(variantQuery, { sku })

      if (!variant) {
        console.log(`  ⚠ Variant not found for SKU: ${sku}`)
        notFoundCount++
        continue
      }

      // Check if it's a "Default Title" variant
      if (variant.store?.title !== 'Default Title') {
        console.log(`  ⚠ Variant "${variant.store?.title}" is not "Default Title", skipping`)
        skippedCount++
        continue
      }

      console.log(`  ✓ Found "Default Title" variant`)

      // Find the parent product
      const productQuery = `*[_type == "product" && store.id == $productId][0] {
        _id,
        store {
          title
        }
      }`

      const product = await client.fetch(productQuery, { productId: variant.store.productId })

      if (!product) {
        console.log(`  ✗ Parent product not found for variant`)
        notFoundCount++
        continue
      }

      console.log(`  ✓ Found parent product: ${product.store?.title}`)

      // Process gallery images for moreImages
      const galleryString = row['Gallery']?.trim()
      const moreImages = await processGalleryImages(galleryString, imagesDir, false)

      // Process meta fields
      const metaFields = processMetaFields(row)

      // Build update object
      const updateData = {}

      if (moreImages.length > 0) {
        updateData.moreImages = moreImages
        console.log(`  ✓ Adding ${moreImages.length} images to moreImages`)
      }

      if (metaFields.length > 0) {
        updateData.metaFields = metaFields
        console.log(`  ✓ Adding ${metaFields.length} meta fields`)
      }

      if (Object.keys(updateData).length === 0) {
        console.log(`  ⚠ No data to update`)
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
