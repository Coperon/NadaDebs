import groq from 'groq'
import { imageQuery, seoQuery } from "./fragments"

export const getInteriorBySlug = async interiorSlug => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_type == "interior" && !(_id in path("drafts.**")) && slug.current == $interiorSlug][0]{
        _id,
        title,
        seo {
            ${seoQuery}
        },
        slug,
        description,
        location,
        year,
        images[] {
            image {
                ${imageQuery}
            },
            video,
        },
        featuredImage {
            ${imageQuery}
        },
        relatedProjects[]->{
            _id,
            title,
            slug,
            featuredImage {
                ${imageQuery}
            }
        },
    }`
    const key = `interior-${interiorSlug}`
    const { data } = await useAsyncData(key, () =>
        $sanity.fetch(query, { interiorSlug: interiorSlug }),
    )
    liveRefetch(data, query, { interiorSlug: interiorSlug })

    // throw 404 if project doesn't exist
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
