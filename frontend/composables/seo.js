import { useSiteStore } from '@/stores/site'
import { useBreadcrumbSchema } from '@/composables/structuredData'

const SITE_NAME = 'Nada Debs'

/**
 * @param {object} seoData  the `seo` object from the document
 * @param {string} title    fallback title when seo.ogtitle is empty
 * @param {object} [image]  fallback share image when seo.ogimage is empty
 * @param {string} [type]   Open Graph type — 'article' for news posts, so
 *                          shares render as an article rather than a website
 */
export function useSeoObject(seoData, title, image = null, type = 'website') {
    const route = useRoute()
    const site = useSiteStore()

    // Every getter in data/ returns the ref from useAsyncData, not its value.
    // Passing that ref straight in silently yields undefined for every field,
    // and the page ships with no title, description, canonical or OG tags at
    // all — a whole-<head> outage that nothing else surfaces. Warn loudly in
    // dev rather than letting it reach a build again.
    if (import.meta.dev) {
        if (isRef(seoData) || isRef(title)) {
            console.warn(
                `[seo] useSeoObject received a ref on ${route?.path} — pass foo?.value?.seo, not foo?.seo`,
            )
        } else if (!seoData?.ogtitle && !title) {
            console.warn(
                `[seo] no title resolved for ${route?.path} — check the field name matches the schema`,
            )
        }
    }
    const siteUrlWithoutTrailingSlash = site?.url?.replace(/\/$/, '')
    const fullRouteWithoutLeadingSlash = route?.path?.replace(/^\//, '')
    const fullRouteWithoutTrailingSlash = fullRouteWithoutLeadingSlash?.replace(
        /\/$/,
        '',
    )
    const canonicalUrl =
        route?.name == 'index'
            ? `${siteUrlWithoutTrailingSlash}/`
            : `${siteUrlWithoutTrailingSlash}/${fullRouteWithoutTrailingSlash}/`

    useHead(() => ({
        link: [
            {
                rel: 'canonical',
                href: canonicalUrl,
            },
        ],
    }))
    const resolvedTitle = seoData?.ogtitle || title
    const resolvedDescription = seoData?.ogdescription
    const resolvedImage = seoData?.ogimage
        ? `${seoData?.ogimage?.asset?.url}?w=1200&auto=format`
        : image
        ? `${image?.asset?.url}?w=1200&auto=format`
        : null

    const seoMeta = {
        title: resolvedTitle,
        ogTitle: resolvedTitle,
        description: resolvedDescription,
        ogDescription: resolvedDescription,
        ogImage: resolvedImage,

        // Everything below was missing entirely. Without og:url and
        // og:site_name a shared link shows no source; without twitter:card,
        // X renders the small square card instead of the wide one, whatever
        // size the image is.
        ogUrl: canonicalUrl,
        ogType: type,
        ogSiteName: SITE_NAME,
        ogLocale: 'en',
        ...(resolvedImage
            ? {
                  ogImageWidth: 1200,
                  ogImageAlt: resolvedTitle,
                  twitterCard: 'summary_large_image',
                  twitterImage: resolvedImage,
                  twitterImageAlt: resolvedTitle,
              }
            : { twitterCard: 'summary' }),
        twitterTitle: resolvedTitle,
        twitterDescription: resolvedDescription,
    }
    useSeoMeta(seoMeta)

    // Every page with SEO also gets a breadcrumb trail. Doing it here rather
    // than per-page means the 751 pages the audit flagged as 3+ clicks deep all
    // gain an explicit hierarchy without touching 30 components.
    useBreadcrumbSchema(resolvedTitle)
}
