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

/**
 * Migrate bare image items in bespoke.sections[].images[] to bespokeMedia objects:
 *   { _type: 'image', asset, ... } → { _type: 'bespokeMedia', image: { _type: 'image', asset, ... } }
 */
function migrateImageItem(item) {
  if (!item || item._type === 'bespokeMedia' || item.image) {
    return {item, changed: false}
  }

  if (item._type === 'image' && item.asset) {
    const {_key, _type, ...imageFields} = item
    return {
      item: {
        _type: 'bespokeMedia',
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

async function migrateBespokeImages() {
  console.log(
    `\n${DRY_RUN ? '[DRY RUN] ' : ''}Migrating bespoke section images to bespokeMedia objects...\n`,
  )

  const docs = await client.fetch(
    `*[_type == "bespoke" && defined(sections)]{ _id, sections }`,
  )

  console.log(`Found ${docs.length} bespoke document(s).\n`)

  for (const doc of docs) {
    let changedCount = 0

    const sections = (doc.sections || []).map((section) => {
      if (!section.images?.length) return section

      const images = section.images.map((item) => {
        const {item: migrated, changed} = migrateImageItem(item)
        if (changed) changedCount++
        return migrated
      })

      return {...section, images}
    })

    if (changedCount === 0) {
      console.log(`  ${doc._id}: nothing to migrate`)
      continue
    }

    console.log(`  ${doc._id}: ${changedCount} image(s) to wrap`)

    if (DRY_RUN) {
      const sample = sections
        .flatMap((s) => s.images || [])
        .find((i) => i._type === 'bespokeMedia')
      if (sample) {
        console.log('    Sample migrated item:', JSON.stringify(sample, null, 2).replace(/^/gm, '    '))
      }
      continue
    }

    try {
      await client.patch(doc._id).set({sections}).commit()
      console.log(`  Patched: ${doc._id}`)
    } catch (err) {
      console.error(`  Error patching ${doc._id}:`, err.message)
    }
  }

  console.log('\nDone!')
}

migrateBespokeImages().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
