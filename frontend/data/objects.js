import groq from 'groq'
import { imageQuery } from "./fragments"

export const getObjects = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq` *[_type == "product" && category == "objects" && !(_id in path("drafts.**"))]|order(createdAt desc) {
        _id,
        title,
        hidden,
        featuredImage {
            ${imageQuery}
        },
        objectsCategory->{
            title,
            slug,
        },
        store {
            createdAt,
            priceRange,
            slug,
            title,
            gid
        }
    }`
    const { data } = await useAsyncData('objects', () => $sanity.fetch(query))
    return data
}