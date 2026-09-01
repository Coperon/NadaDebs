import groq from 'groq'
import { imageQuery, seoQuery } from "./fragments"

export const getPostBySlug = async postSlug => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_type == "post" && !(_id in path("drafts.**")) && slug.current == $postSlug][0]{
        _id,
        title,
        seo {
            ${seoQuery}
        },
        slug,
        cover {
            ${imageQuery}
        },
        date,
        text,
        content
    }`
    const key = `post-${postSlug}`
    // Do NOT reuse the payload that was frozen into _payload.json at build
    // time. Returning undefined forces the browser to re-run the Sanity query
    // on every load, so published edits appear without a rebuild. The
    // server/prerender pass is unaffected, so the HTML still ships with
    // content for search engines and link previews.
    const { data } = await useAsyncData(
        key,
        () => $sanity.fetch(query, { postSlug: postSlug }),
        { getCachedData: () => undefined },
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
