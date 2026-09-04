/**
 * JSON-LD structured data.
 *
 * The site had none before the Sep 2026 SEO audit. Structured data is what
 * produces rich results (breadcrumb trails under a listing, article cards,
 * product panels) and what lets Google associate the site with Nada Debs as an
 * entity rather than as a string that happens to appear a lot.
 *
 * Everything here is emitted server-side during `nuxt generate`, so crawlers
 * see it in the static HTML.
 *
 * ── On Product offers ──────────────────────────────────────────────────────
 * `useProductSchema` deliberately omits `offers`. Price and stock are fetched
 * live from the Shopify Storefront API in the browser and are NOT in the
 * prerendered HTML, so any price emitted here at build time would be a guess.
 * Google treats structured data that contradicts the visible page as a
 * violation, and stale prices are exactly what it looks for. Adding offers
 * requires the price to come from the same source as the visible one —
 * see .docs/seo-sanity-tasks.md.
 */

const SITE_NAME = 'Nada Debs'

function jsonLd(schema) {
    useHead(() => ({
        script: [
            {
                type: 'application/ld+json',
                innerHTML: JSON.stringify(schema),
            },
        ],
    }))
}

function siteUrl() {
    const site = useSiteStore()
    return site?.url?.replace(/\/$/, '') || ''
}

/** Turn "draw-the-line" into "Draw the Line" for a breadcrumb label. */
function humanise(segment) {
    const minor = new Set(['the', 'a', 'an', 'of', 'and', 'in', 'for', 'with', 'to'])
    return decodeURIComponent(segment)
        .replace(/-/g, ' ')
        .split(' ')
        .filter(Boolean)
        .map((word, i) =>
            i > 0 && minor.has(word.toLowerCase())
                ? word.toLowerCase()
                : word.charAt(0).toUpperCase() + word.slice(1),
        )
        .join(' ')
}

/**
 * BreadcrumbList for the current route.
 *
 * Called automatically by useSeoObject, so every page gets one — which also
 * softens the audit's "751 pages are 3+ clicks from the homepage" finding by
 * giving search engines an explicit hierarchy for pages the crawler only
 * reaches deep in a paginated grid.
 *
 * @param {string} [pageTitle] label for the final crumb; falls back to the slug
 */
export function useBreadcrumbSchema(pageTitle) {
    const route = useRoute()
    const base = siteUrl()
    const segments = route.path.split('/').filter(Boolean)

    // The homepage is its own breadcrumb root — a single-item trail says nothing.
    if (segments.length === 0) return

    const items = [{ name: 'Home', item: `${base}/` }]

    segments.forEach((segment, i) => {
        const isLast = i === segments.length - 1
        items.push({
            name: isLast && pageTitle ? pageTitle : humanise(segment),
            item: `${base}/${segments.slice(0, i + 1).join('/')}/`,
        })
    })

    jsonLd({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((entry, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: entry.name,
            item: entry.item,
        })),
    })
}

/**
 * Organization + the founder, for the homepage only.
 *
 * @param {object} [settings] the siteConfig document, for socialLinks
 */
export function useOrganizationSchema(settings) {
    const base = siteUrl()
    const sameAs = (settings?.socialLinks || [])
        .map((link) => link?.url)
        .filter(Boolean)

    jsonLd({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${base}/#organization`,
        name: SITE_NAME,
        url: `${base}/`,
        ...(sameAs.length ? { sameAs } : {}),
        founder: {
            '@type': 'Person',
            name: 'Nada Debs',
        },
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Beirut',
            addressCountry: 'LB',
        },
    })
}

/**
 * Article for a news post.
 *
 * @param {object} post the post document
 */
export function useArticleSchema(post) {
    if (!post) return
    const base = siteUrl()
    const route = useRoute()
    const image =
        post?.seo?.ogimage?.asset?.url ||
        post?.cover?.asset?.url ||
        post?.thumbnail?.asset?.url

    jsonLd({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post?.title,
        ...(post?.date ? { datePublished: post.date } : {}),
        ...(image ? { image: [`${image}?w=1200&auto=format`] } : {}),
        ...(post?.seo?.ogdescription ? { description: post.seo.ogdescription } : {}),
        author: { '@type': 'Organization', name: SITE_NAME },
        publisher: { '@id': `${base}/#organization` },
        mainEntityOfPage: `${base}${route.path.replace(/\/$/, '')}/`,
    })
}

/**
 * Product, without offers — see the note at the top of this file.
 *
 * @param {object} product the product document
 */
export function useProductSchema(product) {
    if (!product) return
    const base = siteUrl()
    const route = useRoute()
    const image = product?.featuredImage?.asset?.url

    jsonLd({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product?.store?.title || product?.title,
        ...(image ? { image: [`${image}?w=1200&auto=format`] } : {}),
        ...(product?.seo?.ogdescription
            ? { description: product.seo.ogdescription }
            : {}),
        brand: { '@type': 'Brand', name: SITE_NAME },
        url: `${base}${route.path.replace(/\/$/, '')}/`,
    })
}
