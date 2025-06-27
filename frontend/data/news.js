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

export const getNextPosts = async (currentPostDate, currentPostId, limit = 3) => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_type == "post" && !(_id in path("drafts.**")) && date < $currentPostDate && _id != $currentPostId]|order(date desc)[0...$limit]{
      _id,
      title,
      slug,
      date,
      thumbnail {
        ${imageQuery}
      },
      text
    }`

    const { data } = await useAsyncData(`next-posts-${currentPostId}`, () =>
        $sanity.fetch(query, { 
            currentPostDate: currentPostDate,
            currentPostId: currentPostId,
            limit: limit
        })
    )
    return data
}
