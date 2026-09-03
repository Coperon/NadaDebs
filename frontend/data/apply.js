import groq from 'groq'
import { seoQuery, imageQuery } from "./fragments"

export const getApply = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq` *[_id == "apply"][0] {
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
    const { data } = await useAsyncData('apply', () =>
        $sanity.fetch(query),
    )
    liveRefetch(data, query)
    return data
}
