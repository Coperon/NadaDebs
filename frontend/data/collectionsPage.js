import groq from 'groq'
import { seoQuery, imageQuery } from "./fragments"

export const getCollectionsPage = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq` *[_id == "collections"][0] {
        _id,
        title,
        description,
        collectionOrder[]->{
            _id,
            title,
            slug,
            year,
            cover {
                ${imageQuery}
            },
            thumbnail {
                ${imageQuery}
            },
        },
        seo {
            ${seoQuery}
        },
    }`
    const { data } = await useAsyncData('collectionsPage', () =>
        $sanity.fetch(query),
    )
    liveRefetch(data, query)
    return data
}
