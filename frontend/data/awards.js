import groq from 'groq'
import { seoQuery, imageQuery } from "./fragments"

export const getAwards = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq` *[_id == "awards"][0] {
        _id,
        title,
        description,
        image {
            ${imageQuery}
        },
        awards[] | order(year desc) {
            title,
            subtitle,
            year,
        },
        seo {
            ${seoQuery}
        },
    }`
    const { data } = await useAsyncData('awards', () =>
        $sanity.fetch(query),
    )
    return data
}
