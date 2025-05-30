import groq from 'groq'
import { linkQuery, textContentQuery, seoQuery, imageQuery } from "./fragments"

export const siteSettings = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_type == "siteConfig"][0]{
        siteTitle,
        currencyCode,
        gtmID,
        cookiesPolicyLink -> {
            _id,
            "slug": slug.current,
        },
        siteLanguage,
        siteFavicon {
            ${imageQuery}
        },
        seo {
            ${seoQuery}
        },
        socialLinks[] {
            title,
            url,
            icon {
                ${imageQuery}
            }
        },
    }`
    const { data } = await useAsyncData('siteSettings', () =>
        $sanity.fetch(query),
    )
    return data
}
