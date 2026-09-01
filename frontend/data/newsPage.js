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
    // Do NOT reuse the payload that was frozen into _payload.json at build
    // time. Returning undefined forces the browser to re-run the Sanity query
    // on every load, so published edits appear without a rebuild. The
    // server/prerender pass is unaffected, so the HTML still ships with
    // content for search engines and link previews.
    const { data } = await useAsyncData(
        'newsPage',
        () => $sanity.fetch(query),
        { getCachedData: () => undefined },
    )
    return data
}
