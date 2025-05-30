import groq from 'groq'
import { seoQuery } from "./fragments"

export const getInfoPageBySlug = async infoPageSlug => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_type == "legal" && !(_id in path("drafts.**")) && slug.current == $infoPageSlug][0]{
        _id,
        title,
        seo {
            ${seoQuery}
        },
        slug,
        content
    }`
    const key = `infoPage-${infoPageSlug}`
    const { data } = await useAsyncData(key, () =>
        $sanity.fetch(query, { infoPageSlug: infoPageSlug }),
    )

    // throw 404 if page doesn't exist
    if (!data.value || Object.keys(data.value).length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Page Not Found',
            // fatal:true if using client previews and want to keep full full-screen error page there
            fatal: true,
        })
    }

    return data
}
