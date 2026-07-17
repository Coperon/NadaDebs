import {createClient} from '@sanity/client'

if (!process.env.SANITY_STUDIO_PROJECT_ID) {
  console.error('Error: SANITY_STUDIO_PROJECT_ID is not set')
  process.exit(1)
}

if (!process.env.SANITY_STUDIO_TOKEN) {
  console.error('Error: SANITY_STUDIO_TOKEN is not set')
  console.error('Please create a token at https://www.sanity.io/manage')
  process.exit(1)
}

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_STUDIO_TOKEN,
})

const DRY_RUN = process.argv.includes('--dry-run')

function migrateItem(item, targetType) {
  if (!item || item._type === targetType || item.image) {
    return {item, changed: false}
  }

  if (item._type === 'image' && item.asset) {
    const {_key, _type, ...imageFields} = item
    return {
      item: {
        _type: targetType,
        ...(_key ? {_key} : {}),
        image: {
          _type: 'image',
          ...imageFields,
        },
      },
      changed: true,
    }
  }

  return {item, changed: false}
}

async function migrateProducts() {
  const docs = await client.fetch(`*[_type == "product" && defined(moreImages)]{ _id, moreImages }`)
  console.log(`Found ${docs.length} product document(s).\n`)

  for (const doc of docs) {
    let changedCount = 0

    const moreImages = (doc.moreImages || []).map((item) => {
      const {item: migrated, changed} = migrateItem(item, 'productMedia')
      if (changed) changedCount++
      return migrated
    })

    if (changedCount === 0) {
      console.log(`  ${doc._id}: nothing to migrate`)
      continue
    }

    console.log(`  ${doc._id}: ${changedCount} moreImages item(s) to wrap`)

    if (DRY_RUN) continue

    try {
      await client.patch(doc._id).set({moreImages}).commit()
      console.log(`  Patched: ${doc._id}`)
    } catch (err) {
      console.error(`  Error patching ${doc._id}:`, err.message)
    }
  }
}

async function migrateProductModels() {
  const docs = await client.fetch(`*[_type == "productModel" && defined(images)]{ _id, images }`)
  console.log(`\nFound ${docs.length} productModel document(s).\n`)

  for (const doc of docs) {
    let changedCount = 0

    const images = (doc.images || []).map((item) => {
      const {item: migrated, changed} = migrateItem(item, 'productModelMedia')
      if (changed) changedCount++
      return migrated
    })

    if (changedCount === 0) {
      console.log(`  ${doc._id}: nothing to migrate`)
      continue
    }

    console.log(`  ${doc._id}: ${changedCount} images item(s) to wrap`)

    if (DRY_RUN) continue

    try {
      await client.patch(doc._id).set({images}).commit()
      console.log(`  Patched: ${doc._id}`)
    } catch (err) {
      console.error(`  Error patching ${doc._id}:`, err.message)
    }
  }
}

async function run() {
  console.log(`\n${DRY_RUN ? '[DRY RUN] ' : ''}Migrating product/productModel media fields...\n`)
  await migrateProducts()
  await migrateProductModels()
  console.log('\nDone!')
}

run().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
