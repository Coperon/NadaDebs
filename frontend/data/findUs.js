import groq from 'groq'
import { seoQuery } from "./fragments"

export const getFindUs = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq` *[_id == "findUs"][0] {
        _id,
        title,
        description,
        offices,
        whereToFindUs,
        seo {
            ${seoQuery}
        },
    }`
    const { data } = await useAsyncData('findUs', () =>
        $sanity.fetch(query),
    )
    return data
}
