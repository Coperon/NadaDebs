import groq from 'groq'
import { imageQuery } from "./fragments"
export const getNews = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_type == "post" && !(_id in path("drafts.**"))]|order(date desc){
      _id,
      title,
      slug,
      date,
      thumbnail {
        ${imageQuery}
      },
      text
    }`

    const { data } = await useAsyncData('news', () => $sanity.fetch(query))
    return data
}
