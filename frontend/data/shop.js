import groq from 'groq'
import { blockContentQuery, imageQuery, seoQuery } from './fragments'

export const getProducts = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_type == "product" && !(_id in path("drafts.**"))]|order(orderRank asc)[0...50]{
    _id,
    title,
    hidden,
    featuredImage {
        ${imageQuery}
    },
    body,
    store {
      status,
      isDeleted,
      title,
      slug,
      priceRange,
      previewImageUrl,
      options,
      variants[]->{
       ...,
      },
      createdAt,
      updatedAt,
      id,
      gid,
      descriptionHtml,
      productType,
      vendor,
      tags
    }
  }`

    const { data } = await useAsyncData('products', () => $sanity.fetch(query))
    return data
}
