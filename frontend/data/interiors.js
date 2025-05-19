import groq from 'groq'
import { imageQuery, seoQuery } from "./fragments"
export const getInteriors = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_type == "interior" && !(_id in path("drafts.**"))]|order(year desc, _createdAt desc){
      _id,
      title,
      slug,
      category,
      location,
      year,
      featuredImage {
        ${imageQuery}
      },
      isFeatured,
      seo {
        ${seoQuery}
      },
    }`

    const { data } = await useAsyncData('interiors', () => $sanity.fetch(query))
    return data
}
