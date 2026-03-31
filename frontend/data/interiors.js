import groq from 'groq'
import { imageQuery } from "./fragments"
export const getInteriors = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_type == "interior" && !(_id in path("drafts.**"))]|order(orderRank asc){
      _id,
      title,
      orderRank,
      slug,
      category->{
        _id,
        title,
        slug
      },
      location,
      year,
      featuredImage {
        ${imageQuery}
      },
      isFeatured
    }`

    const { data } = await useAsyncData('interiors', () => $sanity.fetch(query))
    return data
}
