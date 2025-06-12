import groq from 'groq'
import { imageQuery, seoQuery } from './fragments'

export const getProductBySlug = async productSlug => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_type == "product" && !(_id in path("drafts.**")) && store.slug.current == $productSlug][0]{
      _id,
      title,
      hidden,
      featuredImage {
          ${imageQuery}
      },
      secondaryImage {
          ${imageQuery}
      },
      moreImages[] {
          ${imageQuery}
      },
      description,
      metaFields,
      buyOptions,
      crafts,
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
      },
      seo {
        ${seoQuery}
      },
    }`

    const key = `product-${productSlug}`
    const { data } = await useAsyncData(key, () =>
        $sanity.fetch(query, { productSlug: productSlug }),
    )

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