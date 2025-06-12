import groq from 'groq'
import { imageQuery } from "./fragments"

export const getObjects = async () => {
    const { $sanity } = useNuxtApp()

    const query = groq`{
        "items": *[_type == "product" && category == "objects" && !(_id in path("drafts.**"))]|order(store.createdAt desc) {
            _id,
            title,
            hidden,
            featuredImage {
                ${imageQuery}
            },
            secondaryImage {
                ${imageQuery}
            },
            objectsCategory->{
                title,
                slug,
            },
            buyOptions,
            isFeatured,
            store {
                createdAt,
                priceRange,
                slug,
                title,
                gid,
                variants[]->{
                    store {
                        inventory {
                            isAvailable
                        }
                    }
                }
            }
        }
    }`
    
    const { data } = await useAsyncData('objects', () => $sanity.fetch(query))
    return data
}