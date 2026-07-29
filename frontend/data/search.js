import groq from 'groq'
import { imageQuery } from './fragments'

const ROUTE_PREFIX = {
    craft: '/our-world/crafts',
    collaboration: '/studio/collaborations',
    interior: '/studio/interiors',
    post: '/news/latest',
    collection: '/shop/collections',
}

const query = groq`*[
  _type in ["craft", "collaboration", "interior", "post", "collection"] &&
  !(_id in path("drafts.**")) &&
  title match $q + "*"
]{
  _id,
  _type,
  title,
  "slug": slug.current,
  _type == "craft" => {
    "excerpt": description,
    "image": coalesce(thumbnail.image, images[0].image){${imageQuery}},
  },
  _type == "collaboration" => {
    "excerpt": description,
    "image": featuredImage{${imageQuery}},
  },
  _type == "interior" => {
    "excerpt": description,
    "image": featuredImage{${imageQuery}},
  },
  _type == "post" => {
    "excerpt": text,
    "image": coalesce(thumbnail, cover){${imageQuery}},
  },
  _type == "collection" => {
    "excerpt": aboutTheCollection,
    "image": coalesce(cover, thumbnail){${imageQuery}},
  },
}`

export const searchSanityContent = async (queryString) => {
    const { $sanity } = useNuxtApp()
    try {
        const results = await $sanity.fetch(query, { q: queryString })
        return (results || []).map((item) => ({
            _id: item._id,
            _type: item._type,
            title: item.title,
            image: item.image,
            excerpt: item.excerpt,
            url: `${ROUTE_PREFIX[item._type]}/${item.slug}`,
        }))
    } catch (error) {
        console.error('searchSanityContent: fetch failed', error)
        return []
    }
}

const productImagesQuery = groq`*[
  _type == "product" &&
  !(_id in path("drafts.**")) &&
  store.slug.current in $handles
]{
  "handle": store.slug.current,
  featuredImage {${imageQuery}},
  "previewImageUrl": store.previewImageUrl,
}`

export const getProductImagesByHandles = async (handles) => {
    if (!handles?.length) return {}

    const { $sanity } = useNuxtApp()
    try {
        const results = await $sanity.fetch(productImagesQuery, { handles })
        return (results || []).reduce((map, product) => {
            if (product.handle) {
                map[product.handle] = {
                    featuredImage: product.featuredImage,
                    previewImageUrl: product.previewImageUrl,
                }
            }
            return map
        }, {})
    } catch (error) {
        console.error('getProductImagesByHandles: fetch failed', error)
        return {}
    }
}
