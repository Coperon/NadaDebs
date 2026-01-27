import {createClient} from '@sanity/client'
import * as dotenv from 'dotenv'
import {fileURLToPath} from 'url'
import {dirname, resolve} from 'path'

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

const orphanedIds = [
  '6a13f6a0-79ab-4173-b376-0ef37871564d', // Natural
  '7857af8d-1c3b-4198-b49f-78189cbbcca9', // Colored
]

async function deleteOrphanedSubtypes() {
  console.log('🚀 Deleting orphaned subtypes...\n')

  for (const id of orphanedIds) {
    try {
      const doc = await client.fetch('*[_id == $id][0]{ _id, _type, title }', {id})
      
      if (!doc) {
        console.log(`⚠️  Document ${id} not found`)
        continue
      }

      console.log(`Deleting: ${doc.title} (${doc._type})`)
      await client.delete(id)
      console.log(`✅ Deleted: ${doc.title}\n`)
    } catch (error) {
      console.error(`❌ Error deleting ${id}:`, error.message)
    }
  }

  console.log('✅ Done!')
}

deleteOrphanedSubtypes().catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})
