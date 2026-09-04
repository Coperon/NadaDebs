import { useSiteStore } from '@/stores/site'

export function useSeoObject(seoData, title, image = null) {
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
    const seoMeta = {
        title: seoData?.ogtitle || title,
        ogTitle: seoData?.ogtitle || title,
        description: seoData?.ogdescription,
        ogDescription: seoData?.ogdescription,
        ogImage: seoData?.ogimage
            ? `${seoData?.ogimage?.asset?.url}?w=1200&auto=format`
            : image
            ? `${image?.asset?.url}?w=1200&auto=format`
            : null,
    }
    useSeoMeta(seoMeta)
}
