import groq from 'groq'
import { imageQuery } from "./fragments"

export const getNews = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_type == "post" && !(_id in path("drafts.**"))]|order(date desc){
      _id,
      title,
      slug,
      date,
      thumbnail {
        ${imageQuery}
      },
      text
    }`

    const { data } = await useAsyncData('news', () => $sanity.fetch(query), {
        // Do NOT reuse the payload that was frozen into _payload.json at build
        // time. Returning undefined here forces the browser to re-run the
        // Sanity query on every load, so published edits appear without a
        // rebuild. The server/prerender pass is unaffected, so the HTML still
        // ships with content for search engines and link previews.
        getCachedData: () => undefined,
    })
    return data
}

export const getNextPosts = async (currentPostDate, currentPostId, limit = 3) => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_type == "post" && !(_id in path("drafts.**")) && date < $currentPostDate && _id != $currentPostId]|order(date desc)[0...$limit]{
      _id,
      title,
      slug,
      date,
      thumbnail {
        ${imageQuery}
      },
      text
    }`

    // Do NOT reuse the payload that was frozen into _payload.json at build
    // time. Returning undefined forces the browser to re-run the Sanity query
    // on every load, so published edits appear without a rebuild. The
    // server/prerender pass is unaffected, so the HTML still ships with
    // content for search engines and link previews.
    const { data } = await useAsyncData(
        `next-posts-${currentPostId}`,
        () =>
            $sanity.fetch(query, {
                currentPostDate: currentPostDate,
                currentPostId: currentPostId,
                limit: limit,
            }),
        { getCachedData: () => undefined },
    )
    return data
}
