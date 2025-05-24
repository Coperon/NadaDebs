import groq from 'groq'
import { seoQuery } from "./fragments"

export const getCraftsPage = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq` *[_id == "crafts"][0] {
        _id,
        title,
        description,
        seo {
            ${seoQuery}
        },
    }`
    const { data } = await useAsyncData('craftsPage', () =>
        $sanity.fetch(query),
    )
    return data
}
