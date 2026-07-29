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
  apiVersion: '2025-05-08',
  useCdn: false,
})

// Function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
}

// Read and parse CSV file
const csvFilePath = path.join(__dirname, '../imports/Nada Debs - Product Sheet - Contemporary Crafts.csv')
const csvContent = fs.readFileSync(csvFilePath, 'utf-8')

const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
  trim: true,
})

console.log(`Found ${records.length} crafts to import\n`)

// Import crafts
async function importCrafts() {
  for (const record of records) {
    const craftName = record['Craft Name']
    const description = record['Description'] || record['Brief Description']

    if (!craftName) {
      console.log('Skipping record with no craft name')
      continue
    }

    const slug = generateSlug(craftName)

    const craftDocument = {
      _type: 'craft',
      title: craftName,
      slug: {
        _type: 'slug',
        current: slug,
      },
      description: description || '',
    }

    try {
      console.log(`Importing: ${craftName}`)
      console.log(`  Slug: ${slug}`)
      
      // Check if craft already exists
      const existing = await client.fetch(
        `*[_type == "craft" && slug.current == $slug][0]`,
        { slug }
      )

      if (existing) {
        console.log(`  ⚠️  Craft already exists, updating...`)
        const updated = await client
          .patch(existing._id)
          .set({
            title: craftName,
            description: description || '',
          })
          .unset(['briefDescription'])
          .commit()
        console.log(`  ✓ Updated: ${updated._id}\n`)
      } else {
        const created = await client.create(craftDocument)
        console.log(`  ✓ Created: ${created._id}\n`)
      }
    } catch (error) {
      console.error(`  ✗ Error importing ${craftName}:`, error.message, '\n')
    }
  }

  console.log('Import complete!')
}

// Run the import
importCrafts().catch((error) => {
  console.error('Import failed:', error)
  process.exit(1)
})
