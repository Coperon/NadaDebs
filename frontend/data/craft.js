import groq from 'groq'
import { imageQuery, seoQuery } from "./fragments"

export const getCraftBySlug = async craftSlug => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_type == "craft" && !(_id in path("drafts.**")) && slug.current == $craftSlug][0]{
        _id,
        title,
        seo {
            ${seoQuery}
        },
        slug,
        description,
        thumbnail {
            image {
                ${imageQuery}
            },
            video,
        },
        images[] {
            _key,
            image {
                ${imageQuery}
            },
            video,
        },
        "relatedProducts": *[_type == "product" && references(^._id) && !(_id in path("drafts.**"))]|order(store.createdAt desc){
            ...,
        },
        "relatedProductModels": *[_type == "productModel" && references(^._id) && !(_id in path("drafts.**"))]{
            products[] {
                product->{
                    ...,
                }
            }
        },
        "relatedCollections": *[_type == "collection" && references(^._id) && !(_id in path("drafts.**"))]|order(year desc, createdAt desc) {
            ...,
        }
    }`
    const key = `craft-${craftSlug}`
    const { data } = await useAsyncData(key, () =>
        $sanity.fetch(query, { craftSlug: craftSlug }),
    )
    liveRefetch(data, query, { craftSlug: craftSlug })

    // throw 404 if project doesn't exist
    if (!data.value || Object.keys(data.value).length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Page Not Found',
            // fatal:true if using client previews and want to keep full full-screen error page there
            fatal: true,
        })
    }

    return data
}
