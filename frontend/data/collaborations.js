import groq from 'groq'
import { imageQuery } from "./fragments"
export const getCollaborations = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_type == "collaboration" && !(_id in path("drafts.**"))]|order(orderRank asc){
      _id,
      title,
      orderRank,
      slug,
      featuredImage {
        ${imageQuery}
      },
      isFeatured
    }`

    const { data } = await useAsyncData('collaborations', () => $sanity.fetch(query))
    return data
}
