/**
 * Shared slug options and validation for document types that produce a public
 * URL.
 *
 * Sanity's slug field is free text — the "Generate" button slugifies, but a
 * hand-typed value is stored exactly as entered. Nine collections and one
 * interior reached production with raw titles as their slug, producing URLs
 * like:
 *
 *     /shop/collections/arabian nights /     (note the trailing space)
 *     /shop/collections/Coming to Life/
 *     /studio/interiors/OkhunguzarMosque/
 *
 * Those caused 9 hard 404s, 12 redirect loops and 6 canonical errors in the
 * Sep 2026 SEO audit: the lowercase form resolved, but the canonical tag
 * pointed at the mixed-case one, which pointed back.
 *
 * `slugify` normalises anything the Generate button produces; `validateSlug`
 * stops a bad value being published even if it is typed by hand or arrives
 * through an import.
 *
 * Usage:
 *
 *     import {slugify, validateSlug} from './fields/slugRules'
 *
 *     {
 *         name: 'slug',
 *         type: 'slug',
 *         options: {source: 'title', slugify},
 *         validation: validateSlug,
 *     }
 */

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

// Combining diacritics, left behind once NFKD splits "é" into "e" + accent.
const COMBINING_MARKS = /[̀-ͯ]/g

export function slugify(input) {
    return String(input || '')
        .normalize('NFKD')
        .replace(COMBINING_MARKS, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-') // any run of other characters becomes one dash
        .replace(/^-+|-+$/g, '') // never lead or trail with a dash
        .slice(0, 96)
}

export const validateSlug = (Rule) =>
    Rule.required().custom((value) => {
        const current = value?.current

        if (!current) return 'A slug is required — click "Generate".'

        if (current !== current.trim()) {
            return 'The slug has a leading or trailing space. Click "Generate" to fix it.'
        }

        if (!SLUG_PATTERN.test(current)) {
            return `"${current}" is not a valid URL slug. Use lowercase letters, numbers and single dashes only — for example "${slugify(current)}".`
        }

        return true
    })
