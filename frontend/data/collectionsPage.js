import groq from 'groq'
import { seoQuery } from "./fragments"

export const getCollectionsPage = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq` *[_id == "collections"][0] {
        _id,
        title,
        description,
        seo {
            ${seoQuery}
        },
    }`
    const { data } = await useAsyncData('collectionsPage', () =>
        $sanity.fetch(query),
    )
    return data
}
