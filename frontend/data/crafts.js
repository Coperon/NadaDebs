import groq from 'groq'
import { imageQuery } from "./fragments"
export const getCrafts = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_type == "craft" && !(_id in path("drafts.**"))]|order(title asc){
      _id,
      title,
      slug,
      thumbnail {
        image {
            ${imageQuery}
        },
        video,
      },
    }`

    const { data } = await useAsyncData('crafts', () => $sanity.fetch(query))
    return data
}
