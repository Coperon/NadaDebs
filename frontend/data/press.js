import groq from 'groq'
import { seoQuery, imageQuery } from "./fragments"

export const getPress = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq` *[_id == "press"][0] {
        _id,
        title,
        description,
        articles[] | order(date desc) {
            date,
            image {
                ${imageQuery}
            },
            type,
            link,
            "pdf": pdf.asset->url,
        },
        seo {
            ${seoQuery}
        },
    }`
    const { data } = await useAsyncData('press', () =>
        $sanity.fetch(query),
    )
    return data
}
