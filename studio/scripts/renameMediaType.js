import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_STUDIO_TOKEN,
})

const DRY_RUN = process.argv.includes('--dry-run')

async function renameMediaType() {
  console.log(`\n${DRY_RUN ? '[DRY RUN] ' : ''}Renaming _type "media" in images arrays...\n`)

  const migrations = [
    {documentType: 'collaboration', newType: 'collaborationMedia'},
    {documentType: 'interior', newType: 'interiorMedia'},
  ]

  for (const {documentType, newType} of migrations) {
    const docs = await client.fetch(
      `*[_type == $type && defined(images) && count(images[_type == "media"]) > 0]{ _id, images }`,
      {type: documentType}
    )

    console.log(`Found ${docs.length} ${documentType} document(s) with legacy "media" type items.`)

    for (const doc of docs) {
      const updatedImages = doc.images.map((item) =>
        item._type === 'media' ? {...item, _type: newType} : item
      )

      if (DRY_RUN) {
        console.log(`  [DRY RUN] Would patch: ${doc._id}`)
        continue
      }

      try {
        await client.patch(doc._id).set({images: updatedImages}).commit()
        console.log(`  Patched: ${doc._id}`)
      } catch (err) {
        console.error(`  Error patching ${doc._id}:`, err.message)
      }
    }

    console.log()
  }

  console.log('Done!')
}

renameMediaType().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
