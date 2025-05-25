import groq from 'groq'
import { seoQuery } from "./fragments"

export const getNewsPage = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq` *[_id == "news"][0] {
        _id,
        title,
        description,
        seo {
            ${seoQuery}
        },
    }`
    const { data } = await useAsyncData('newsPage', () =>
        $sanity.fetch(query),
    )
    return data
}
