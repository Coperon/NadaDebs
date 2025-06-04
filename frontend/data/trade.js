import groq from 'groq'
import { seoQuery, imageQuery } from "./fragments"

export const getTrade = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq` *[_id == "trade"][0] {
        _id,
        title,
        description,
        image {
            ${imageQuery}
        },
        seo {
            ${seoQuery}
        },
    }`
    const { data } = await useAsyncData('trade', () =>
        $sanity.fetch(query),
    )
    return data
}
