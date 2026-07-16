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
    "excerpt": briefDescription,
    "image": coalesce(thumbnail.image, cover){${imageQuery}},
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
