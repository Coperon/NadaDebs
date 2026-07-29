import {createClient} from '@sanity/client'
import {randomBytes} from 'node:crypto'
import {readFileSync, existsSync} from 'node:fs'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return
  for (const line of readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!(key in process.env)) {
      process.env[key] = value
    }
  }
}

loadEnvFile(join(__dirname, '../.env'))
loadEnvFile(join(__dirname, '../.env.local'))

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

function makeKey() {
  return randomBytes(6).toString('hex')
}

/**
 * Build craft.images[] from legacy cover + content[] media blocks.
 * Drops contentText blocks and Format (size) from media items.
 */
function buildImages(doc) {
  const images = []
  let fromCover = 0
  let fromContent = 0
  let skippedText = 0

  if (doc.cover?.asset) {
    images.push({
      _type: 'craftMedia',
      _key: makeKey(),
      image: doc.cover,
    })
    fromCover = 1
  }

  for (const block of doc.content || []) {
    if (block._type === 'contentText') {
      skippedText++
      continue
    }

    if (block._type === 'contentMedia' && block.image?.asset) {
      const item = {
        _type: 'craftMedia',
        _key: block._key || makeKey(),
        image: block.image,
      }
      if (block.video) {
        item.video = block.video
      }
      images.push(item)
      fromContent++
    }
  }

  return {images, fromCover, fromContent, skippedText}
}

async function migrateCraftDetailMedia() {
  console.log(
    `\n${DRY_RUN ? '[DRY RUN] ' : ''}Migrating craft cover/content → images[], removing briefDescription...\n`,
  )

  const docs = await client.fetch(
    `*[_type == "craft"]{
      _id,
      title,
      briefDescription,
      cover,
      content,
      images
    }`,
  )

  console.log(`Found ${docs.length} craft document(s).\n`)

  let patched = 0
  let skipped = 0

  for (const doc of docs) {
    const hasBrief = typeof doc.briefDescription === 'string'
    const hasCover = Boolean(doc.cover)
    const hasContent = Array.isArray(doc.content) && doc.content.length > 0
    const hasImages = Array.isArray(doc.images) && doc.images.length > 0

    // Already migrated: images present, legacy fields gone
    if (hasImages && !hasBrief && !hasCover && !hasContent) {
      console.log(`  ${doc._id} (${doc.title || 'untitled'}): already migrated`)
      skipped++
      continue
    }

    // Images already set — only clear leftover legacy fields
    if (hasImages && (hasBrief || hasCover || hasContent)) {
      console.log(
        `  ${doc._id} (${doc.title || 'untitled'}): images already set, unsetting legacy fields only`,
      )
      if (!DRY_RUN) {
        try {
          await client.patch(doc._id).unset(['briefDescription', 'cover', 'content']).commit()
          console.log(`  Patched: ${doc._id}`)
          patched++
        } catch (err) {
          console.error(`  Error patching ${doc._id}:`, err.message)
        }
      } else {
        patched++
      }
      continue
    }

    if (!hasBrief && !hasCover && !hasContent) {
      console.log(`  ${doc._id} (${doc.title || 'untitled'}): nothing to migrate`)
      skipped++
      continue
    }

    const {images, fromCover, fromContent, skippedText} = buildImages(doc)

    console.log(
      `  ${doc._id} (${doc.title || 'untitled'}): ` +
        `${images.length} image(s) ` +
        `(cover: ${fromCover}, content media: ${fromContent}, text dropped: ${skippedText})` +
        `${hasBrief ? ', unset briefDescription' : ''}`,
    )

    if (DRY_RUN) {
      if (images[0]) {
        console.log(
          '    Sample image item:',
          JSON.stringify(images[0], null, 2).replace(/^/gm, '    '),
        )
      }
      patched++
      continue
    }

    try {
      await client
        .patch(doc._id)
        .set({images})
        .unset(['briefDescription', 'cover', 'content'])
        .commit()
      console.log(`  Patched: ${doc._id}`)
      patched++
    } catch (err) {
      console.error(`  Error patching ${doc._id}:`, err.message)
    }
  }

  console.log(`\nDone! ${patched} migrated, ${skipped} skipped.`)
}

migrateCraftDetailMedia().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
