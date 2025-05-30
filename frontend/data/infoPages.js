import groq from 'groq'
export const getInfoPages = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_type == "legal" && !(_id in path("drafts.**"))]{
      _id,
      title,
      slug,
      content
    }`

    const { data } = await useAsyncData('infoPages', () => $sanity.fetch(query))
    return data
}
