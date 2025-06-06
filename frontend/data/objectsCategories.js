import groq from 'groq'

export const getObjectsCategories = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_type == "objectsCategory" && !(_id in path("drafts.**"))]|order(title asc){
        _id,
        title,
        slug
    }`

    const { data } = await useAsyncData('objectsCategories', () => $sanity.fetch(query))
    return data
}