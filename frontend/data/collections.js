import groq from 'groq'
import { imageQuery } from "./fragments"
export const getCollections = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_type == "collection" && !(_id in path("drafts.**"))]|order(year desc, createdAt desc){
      _id,
      title,
      slug,
      year,
      cover {
        ${imageQuery}
      },
      thumbnail {
        ${imageQuery}
      },
    }`

    const { data } = await useAsyncData('collections', () => $sanity.fetch(query))
    liveRefetch(data, query)
    return data
}
