import groq from 'groq'
import { seoQuery, imageQuery } from "./fragments"

export const getContact = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq` *[_id == "contact"][0] {
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
    const { data } = await useAsyncData('contact', () =>
        $sanity.fetch(query),
    )
    return data
}
