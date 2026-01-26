import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parse } from 'csv-parse/sync'
import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') })

// Verify required environment variables
if (!process.env.SANITY_STUDIO_PROJECT_ID) {
  console.error('❌ Error: SANITY_STUDIO_PROJECT_ID is not set in .env file')
  process.exit(1)
}

if (!process.env.SANITY_STUDIO_TOKEN) {
  console.error('❌ Error: SANITY_STUDIO_TOKEN is not set in .env file')
  console.error('Please create a token at https://www.sanity.io/manage')
  process.exit(1)
}

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

console.log(`Using project: ${projectId}, dataset: ${dataset}\n`)

// Initialize Sanity client
const client = createClient({
  projectId: projectId,
  dataset: dataset,
  token: process.env.SANITY_STUDIO_TOKEN,
  apiVersion: '2023-05-03',
  useCdn: false,
})

// Function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Function to upload image to Sanity
async function uploadImage(imagePath) {
  try {
    if (!fs.existsSync(imagePath)) {
      console.log(`    ⚠️  Image not found: ${imagePath}`)
      return null
    }

    const imageBuffer = fs.readFileSync(imagePath)
    const asset = await client.assets.upload('image', imageBuffer, {
      filename: path.basename(imagePath),
    })

    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    }
  } catch (error) {
    console.log(`    ✗ Error uploading image ${imagePath}:`, error.message)
    return null
  }
}

// Function to find product by title
async function findProductByTitle(title) {
  const trimmedTitle = title.trim()
  const product = await client.fetch(
    `*[_type == "product" && store.title == $title][0]{ _id, "title": store.title }`,
    { title: trimmedTitle }
  )
  return product
}

// Function to find craft by title
async function findCraftByTitle(title) {
  const trimmedTitle = title.trim()
  const craft = await client.fetch(
    `*[_type == "craft" && title == $title][0]{ _id, title }`,
    { title: trimmedTitle }
  )
  return craft
}

// Read and parse CSV file
const csvFilePath = path.join(__dirname, '../imports/Nada Debs - Product Sheet - Sanity product models.csv')
const csvContent = fs.readFileSync(csvFilePath, 'utf-8')

const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
  trim: true,
})

console.log(`Found ${records.length} product models to import\n`)

// Import product models
async function importProductModels() {
  for (const record of records) {
    const modelTitle = record['Product Model']
    const linkedProducts = record['Linked products']
    const description = record['Description']
    const makingOfImages = record['Making of']
    const craftNames = record['Craft']
    const optionsLabel = record['Label for options']

    if (!modelTitle) {
      console.log('Skipping record with no product model name')
      continue
    }

    console.log(`\nImporting: ${modelTitle}`)

    // Process linked products
    let productsArray = []
    if (linkedProducts) {
      const productTitles = linkedProducts.split(',').map(p => p.trim())
      console.log(`  Finding ${productTitles.length} linked products...`)
      
      for (const productTitle of productTitles) {
        const product = await findProductByTitle(productTitle)
        if (product) {
          console.log(`    ✓ Found: ${productTitle}`)
          // Note: optionName and swatch are not in CSV, would need to be added manually
          productsArray.push({
            _type: 'object',
            _key: `product-${Math.random().toString(36).substr(2, 9)}`,
            product: {
              _type: 'reference',
              _ref: product._id,
            },
            // These fields are required but not in CSV - set placeholder values
            optionName: productTitle.replace(modelTitle, '').trim() || 'Default',
            // swatch would need to be added manually
          })
        } else {
          console.log(`    ⚠️  Product not found: ${productTitle}`)
        }
      }
    }

    // Process making of images
    let makingOfArray = []
    if (makingOfImages) {
      const imageFilenames = makingOfImages.split(',').map(f => f.trim())
      console.log(`  Uploading ${imageFilenames.length} making-of images...`)
      
      for (const filename of imageFilenames) {
        const imagePath = path.join(__dirname, '../imports/images', filename)
        const uploadedImage = await uploadImage(imagePath)
        
        if (uploadedImage) {
          console.log(`    ✓ Uploaded: ${filename}`)
          makingOfArray.push({
            _type: 'object',
            _key: `making-of-${Math.random().toString(36).substr(2, 9)}`,
            image: uploadedImage,
          })
        }
      }
    }

    // Process craft references
    let craftsArray = []
    if (craftNames) {
      const craftTitles = craftNames.split(',').map(c => c.trim()).filter(c => c)
      if (craftTitles.length > 0) {
        console.log(`  Finding ${craftTitles.length} craft(s)...`)
        
        for (const craftTitle of craftTitles) {
          const craft = await findCraftByTitle(craftTitle)
          if (craft) {
            console.log(`    ✓ Found craft: ${craftTitle}`)
            craftsArray.push({
              _type: 'reference',
              _ref: craft._id,
              _key: `craft-${Math.random().toString(36).substr(2, 9)}`,
            })
          } else {
            console.log(`    ⚠️  Craft not found: ${craftTitle}`)
          }
        }
      }
    } else {
      console.log(`  No crafts specified in CSV`)
    }

    // Build product model document
    const productModelDocument = {
      _type: 'productModel',
      title: modelTitle,
      optionsLabel: optionsLabel || undefined,
      description: description || undefined,
    }

    // Add optional arrays only if they have content
    if (productsArray.length > 0) {
      productModelDocument.products = productsArray
    }
    if (makingOfArray.length > 0) {
      productModelDocument.makingOf = makingOfArray
    }
    if (craftsArray.length > 0) {
      productModelDocument.crafts = craftsArray
    }

    try {
      // Check if product model already exists
      const slug = generateSlug(modelTitle)
      const existing = await client.fetch(
        `*[_type == "productModel" && title == $title][0]`,
        { title: modelTitle }
      )

      if (existing) {
        console.log(`  ⚠️  Product model already exists, updating...`)
        const updated = await client
          .patch(existing._id)
          .set(productModelDocument)
          .commit()
        console.log(`  ✓ Updated: ${updated._id}`)
      } else {
        const created = await client.create(productModelDocument)
        console.log(`  ✓ Created: ${created._id}`)
      }
    } catch (error) {
      console.error(`  ✗ Error importing ${modelTitle}:`, error.message)
    }
  }

  console.log('\n✓ Import complete!')
  console.log('\nNote: Product "swatch" fields need to be added manually in Sanity Studio.')
}

// Run the import
importProductModels().catch((error) => {
  console.error('Import failed:', error)
  process.exit(1)
})
