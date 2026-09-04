import groq from 'groq'
export const getPositions = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_type == "position" && !(_id in path("drafts.**"))]|order(openUntil asc){
      _id,
      position,
      slug,
      location,
      experience,
      type,
      openUntil
    }`

    const { data } = await useAsyncData('positions', () => $sanity.fetch(query))
    liveRefetch(data, query)
    return data
}
