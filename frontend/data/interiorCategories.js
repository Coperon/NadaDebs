import groq from 'groq'

export const getInteriorCategories = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_type == "interiorCategory" && !(_id in path("drafts.**"))]|order(title asc){
        _id,
        title,
        slug
    }`

    const { data } = await useAsyncData('interiorCategories', () => $sanity.fetch(query))
    liveRefetch(data, query)
    return data
}