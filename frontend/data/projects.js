import groq from 'groq'
import { blockContentQuery, imageQuery, seoQuery } from "./fragments"
export const getProjects = async () => {
    const { $sanity } = useNuxtApp()  
    const query = groq`*[_type == "project" && !(_id in path("drafts.**"))]|order(orderRank asc)[0...50]{
      _id,
      title,
      orderRank,
      seo {
        ${seoQuery}
      },
      slug,
      date,
      featuredImage {
        ${imageQuery}
      },
      content[]{
        ${blockContentQuery}
      }  
    }`

    const { data } = await useAsyncData('projects', () => $sanity.fetch(query))
    liveRefetch(data, query)
    return data
  }
