import { useSiteStore } from '@/stores/site'

export function useSeoObject(seoData, title, image = null) {
    const route = useRoute()
    const site = useSiteStore()
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
