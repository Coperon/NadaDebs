import groq from 'groq'
import { imageQuery, seoQuery } from "./fragments"

export const getCollectionBySlug = async collectionSlug => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_type == "collection" && !(_id in path("drafts.**")) && slug.current == $collectionSlug][0]{
        _id,
        title,
        seo {
            ${seoQuery}
        },
        slug,
        year,
        cover {
            ${imageQuery}
        },
        tags,
        aboutTheCollection,
        lifestyleImages,
        featuredText,
        imagesGrid,
        crafts[]->{
            ...,
        },
        relatedProducts[]->{
            ...,
        },
    }`
    const key = `collection-${collectionSlug}`
    const { data } = await useAsyncData(key, () =>
        $sanity.fetch(query, { collectionSlug: collectionSlug }),
    )
    liveRefetch(data, query, { collectionSlug: collectionSlug })

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
