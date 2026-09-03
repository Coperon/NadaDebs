import groq from 'groq'
import { seoQuery } from "./fragments"

export const getCollaborationsPage = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq` *[_id == "collaborations"][0] {
        _id,
        title,
        description,
        seo {
            ${seoQuery}
        },
    }`
    const { data } = await useAsyncData('collaborationsPage', () =>
        $sanity.fetch(query),
    )
    liveRefetch(data, query)
    return data
}
