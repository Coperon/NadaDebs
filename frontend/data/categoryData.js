import groq from 'groq'
import { imageQuery, seoQuery } from "./fragments"

export const getProducts = async (categoryType) => {
    const { $sanity } = useNuxtApp()
    const pageId = categoryType
    const query = groq`*[_id == $pageId][0] {
        "items": productOrder[]->{
            _id,
            title,
            hidden,
            featuredImage {
                ${imageQuery}
            },
            secondaryImage {
                ${imageQuery}
            },
            ${categoryType}Category->{
                title,
                slug,
            },
            ${categoryType}Subtype->{
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
                previewImageUrl,
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
    const { data } = await useAsyncData(`${categoryType}Products`, () => $sanity.fetch(query, { pageId }))
    liveRefetch(data, query, { pageId })
    return data
}

export const getCategoryPage = async (pageId) => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_id == "${pageId}"][0] {
        _id,
        title,
        description,
        seo {
            ${seoQuery}
        },
    }`
    const { data } = await useAsyncData(`${pageId}Page`, () => $sanity.fetch(query))
    liveRefetch(data, query)
    return data
}

export const getCategories = async (categoryType) => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_type == "${categoryType}Category" && !(_id in path("drafts.**"))]|order(title asc){
        _id,
        title,
        slug,
        "parentTitle": parentType->title,
        "isSubType": defined(parentType),
        "parentId": parentType->_id,
        "parentCategory": parentType
    }`
    const { data } = await useAsyncData(`${categoryType}Categories`, () => $sanity.fetch(query))
    liveRefetch(data, query)
    
    const mainTypes = data.value.filter(type => !type.isSubType)
    const subTypes = data.value.filter(type => type.isSubType)

    const hierarchical = mainTypes.map(main => ({
        ...main,
        subTypes: subTypes.filter(sub => sub.parentId === main._id)
    }))

    return hierarchical
} 