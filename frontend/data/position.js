import groq from 'groq'
import { imageQuery, seoQuery } from "./fragments"

export const getPositionBySlug = async positionSlug => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_type == "position" && !(_id in path("drafts.**")) && slug.current == $positionSlug][0]{
        _id,
        position,
        seo {
            ${seoQuery}
        },
        slug,
        location,
        experience,
        type,
        openUntil,
        applyLink,
        aboutThePosition,
        image {
            ${imageQuery}
        }
    }`
    const key = `position-${positionSlug}`
    const { data } = await useAsyncData(key, () =>
        $sanity.fetch(query, { positionSlug: positionSlug }),
    )

    // throw 404 if position doesn't exist
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
