import groq from 'groq'
import { imageQuery, seoQuery } from "./fragments"
export const getCrafts = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_type == "craft" && !(_id in path("drafts.**"))]|order(title asc){
      _id,
      title,
      slug,
      briefDescription,
      thumbnail {
        image {
            ${imageQuery}
        },
        video,
      },
      seo {
        ${seoQuery}
      },
    }`

    const { data } = await useAsyncData('crafts', () => $sanity.fetch(query))
    return data
}
