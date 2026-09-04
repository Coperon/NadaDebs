import groq from 'groq'
import { imageQuery } from "./fragments"

// Listings show a two-line excerpt (line-clamp-2), but CSS only hides the rest
// — the full article body still shipped in the HTML. That made /news/latest/
// the largest page on the site at 6,432 words and had every article flagged as
// duplicate content against the listing. Truncate at the query instead, so the
// listing never receives text it is not going to show.
//
// The article page itself uses getPostBySlug(), which keeps the full text.
const excerptQuery = `"text": array::join(string::split(text, " ")[0...32], " ")`

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
      ${excerptQuery}
    }`

    const { data } = await useAsyncData('news', () => $sanity.fetch(query))
    liveRefetch(data, query)


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
      ${excerptQuery}
    }`

    const { data } = await useAsyncData(`next-posts-${currentPostId}`, () =>
        $sanity.fetch(query, {
            currentPostDate: currentPostDate,
            currentPostId: currentPostId,
            limit: limit
        })
    )
    liveRefetch(data, query, {
            currentPostDate: currentPostDate,
            currentPostId: currentPostId,
            limit: limit
        })

    // See getNews above.

    return data
}
