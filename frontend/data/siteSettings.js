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
        onlyUAE,
        socialLinks[] {
            title,
            url,
            icon {
                ${imageQuery}
            }
        },
        termsAndConditions -> {
            _id,
            title,
            slug,
        },
        privacyPolicy -> {
            _id,
            title,
            slug,
        },
        shippingPolicy -> {
            _id,
            title,
            slug,
        },
    }`
    const { data } = await useAsyncData('siteSettings', () =>
        $sanity.fetch(query),
    )
    liveRefetch(data, query)
    return data
}
