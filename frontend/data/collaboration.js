import groq from 'groq'
import { imageQuery, seoQuery } from "./fragments"

export const getCollaborationBySlug = async collaborationSlug => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_type == "collaboration" && !(_id in path("drafts.**")) && slug.current == $collaborationSlug][0]{
        _id,
        title,
        seo {
            ${seoQuery}
        },
        slug,
        description,
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
        relatedCollaborations[]->{
            _id,
            title,
            slug,
            featuredImage {
                ${imageQuery}
            }
        },
    }`
    const key = `collaboration-${collaborationSlug}`
    const { data } = await useAsyncData(key, () =>
        $sanity.fetch(query, { collaborationSlug: collaborationSlug }),
    )

    // throw 404 if collaboration doesn't exist
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
