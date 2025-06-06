import groq from 'groq'
import { seoQuery } from "./fragments"

export const getObjectsPage = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq` *[_id == "objects"][0] {
        _id,
        title,
        description,
        seo {
            ${seoQuery}
        },
    }`
    const { data } = await useAsyncData('objectsPage', () =>
        $sanity.fetch(query),
    )
    return data
}
