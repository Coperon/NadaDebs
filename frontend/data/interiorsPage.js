import groq from 'groq'
import { seoQuery } from "./fragments"

export const getInteriorsPage = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq` *[_id == "interiors"][0] {
        _id,
        title,
        description,
        seo {
            ${seoQuery}
        },
    }`
    const { data } = await useAsyncData('interiorsPage', () =>
        $sanity.fetch(query),
    )
    return data
}
