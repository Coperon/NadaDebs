import groq from 'groq'
import { seoQuery, imageQuery } from "./fragments"

export const getBespokePage = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq` *[_id == "bespoke"][0] {
        _id,
        title,
        description,
        featuredImage {
            ${imageQuery}
        },
        sections[] {
            title,
            highlightedText,
            images[] {
                image {
                    ${imageQuery}
                },
                video,
            },
        },
        relatedProducts[]->{
            ...,
        },
        seo {
            ${seoQuery}
        },
    }`
    const { data } = await useAsyncData('bespokePage', () =>
        $sanity.fetch(query),
    )
    return data
}
