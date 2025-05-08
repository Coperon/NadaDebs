import groq from 'groq'
import { linkQuery, textContentQuery, seoQuery, imageQuery } from "./fragments"

export const siteSettings = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_type == "siteConfig"][0]{
        siteTitle,
        siteUrl,
        currencyCode,
        gtmID,
        cookiesPolicyLink -> {
            _id,
            "slug": slug.current,
        },
        siteLanguage,
        siteLogo,
        siteFavicon {
            ${imageQuery}
        },
        mainNav ->{
            ...,
            items [] { 
              ...,
              link {
                ${linkQuery}
              }
            }, 
        },
        seo {
            ${seoQuery}
        },
        socialLinks[] {
            title,
            url,
        },
        legalLinks[] -> {
            _id,
            title,
            slug,
        },
        credits []{
            ${textContentQuery}
        },
        contact
    }`
    const { data } = await useAsyncData('siteSettings', () =>
        $sanity.fetch(query),
    )
    return data
}
