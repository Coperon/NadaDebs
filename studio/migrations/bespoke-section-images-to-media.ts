import {defineMigration, set} from 'sanity/migrate'

/**
 * Migrates bespoke section images from bare image objects:
 *   { _type: 'image', _key, asset, ... }
 * to media objects matching the new schema:
 *   { _type: 'bespokeMedia', _key, image: { _type: 'image', asset, ... } }
 *
 * Idempotent: already-migrated `bespokeMedia` items are skipped.
 */
export default defineMigration({
  title: 'Wrap bespoke section images in bespokeMedia objects',
  documentTypes: ['bespoke'],
  migrate: {
    node(node, path) {
      // Only transform direct children of an "images" array
      // e.g. path: ['sections', 0, 'images', 2]
      if (
        path.length < 2 ||
        path[path.length - 2] !== 'images' ||
        typeof path[path.length - 1] !== 'number'
      ) {
        return
      }

      if (
        !node ||
        typeof node !== 'object' ||
        Array.isArray(node) ||
        node._type !== 'image' ||
        !('asset' in node)
      ) {
        return
      }

      const {_key, _type, ...imageFields} = node as {
        _key?: string
        _type: string
        [key: string]: unknown
      }

      return set({
        _type: 'bespokeMedia',
        ...(_key ? {_key} : {}),
        image: {
          _type: 'image',
          ...imageFields,
        },
      })
    },
  },
})
