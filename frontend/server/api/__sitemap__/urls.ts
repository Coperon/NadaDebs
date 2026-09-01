import { createClient } from '@sanity/client'

/**
 * Sitemap source for routes that are not prerendered.
 *
 * @nuxtjs/sitemap discovers URLs from prerendered routes. Under the hybrid
 * config, /news/latest/** is served by ISR and excluded from the build-time
 * crawl, so the module can no longer see those URLs and they would silently
 * vanish from sitemap.xml. This source re-adds them from Sanity.
 *
 * Safe to leave enabled when HYBRID_NEWS is off: the URLs are then discovered
 * both by the crawler and here, and the module de-duplicates.
 */
export default defineSitemapEventHandler(async () => {
    const { sanity } = useRuntimeConfig().public

    const client = createClient({
        projectId: sanity.projectId,
        dataset: sanity.dataset,
        apiVersion: sanity.apiVersion,
        useCdn: sanity.useCdn,
    })

    const posts = await client.fetch(
        `*[_type == "post" && !(_id in path("drafts.**")) && defined(slug.current)]{
            "slug": slug.current,
            date,
            _updatedAt
        }`,
    )

    return posts.map((post: { slug: string; date?: string; _updatedAt?: string }) =>
        asSitemapUrl({
            loc: `/news/latest/${post.slug}`,
            lastmod: post._updatedAt || post.date,
        }),
    )
})
