import groq from 'groq'
import { imageQuery, seoQuery } from "./fragments"
export const getCollaborations = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_type == "collaboration" && !(_id in path("drafts.**"))]|order(year desc, _createdAt desc){
      _id,
      title,
      slug,
      featuredImage {
        ${imageQuery}
      },
      isFeatured,
      seo {
        ${seoQuery}
      },
    }`

    const { data } = await useAsyncData('collaborations', () => $sanity.fetch(query))
    return data
}
