import groq from 'groq'
import { imageQuery, seoQuery } from "./fragments"

export const getCraftBySlug = async craftSlug => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_type == "craft" && !(_id in path("drafts.**")) && slug.current == $craftSlug][0]{
        _id,
        title,
        seo {
            ${seoQuery}
        },
        slug,
        briefDescription,
        description,
        thumbnail {
            image {
                ${imageQuery}
            },
            video,
        },
        cover {
            ${imageQuery}
        },
        content
    }`
    const key = `craft-${craftSlug}`
    const { data } = await useAsyncData(key, () =>
        $sanity.fetch(query, { craftSlug: craftSlug }),
    )

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
