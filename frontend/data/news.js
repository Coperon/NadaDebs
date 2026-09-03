import groq from 'groq'
import { imageQuery } from "./fragments"

export const getNews = async () => {
    const { $sanity, $sanityFresh } = useNuxtApp()
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

    const { data } = await useAsyncData('news', () => $sanity.fetch(query))

    // Re-query in the browser so posts published since the last build show up
    // in the listing. Runs on top of the prerendered payload — see data/post.js
    // for why failures are swallowed rather than surfaced.
    if (import.meta.client) {
        // Re-query Sanity in the browser so content published since the last
        // build appears without a rebuild.
        //
        // This deliberately does NOT use useAsyncData's refresh(). That helper
        // short-circuits in several situations — while Nuxt is hydrating it
        // returns the prerendered payload without calling the handler at all —
        // which made it report success while never contacting Sanity.
        // A plain fetch has no cache semantics to fight.
        //
        // The result is assigned on top of the prerendered data, and failures
        // are ignored on purpose: if Sanity is unreachable the already-rendered
        // content stays on screen rather than collapsing to an error.
        $sanityFresh.fetch(query)
            .then((fresh) => {
                if (fresh) data.value = fresh
            })
            .catch(() => {})
    }

    return data
}

export const getNextPosts = async (currentPostDate, currentPostId, limit = 3) => {
    const { $sanity, $sanityFresh } = useNuxtApp()
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

    const { data } = await useAsyncData(`next-posts-${currentPostId}`, () =>
        $sanity.fetch(query, {
            currentPostDate: currentPostDate,
            currentPostId: currentPostId,
            limit: limit
        })
    )

    // See getNews above.
    if (import.meta.client) {
        // Re-query Sanity in the browser so content published since the last
        // build appears without a rebuild.
        //
        // This deliberately does NOT use useAsyncData's refresh(). That helper
        // short-circuits in several situations — while Nuxt is hydrating it
        // returns the prerendered payload without calling the handler at all —
        // which made it report success while never contacting Sanity.
        // A plain fetch has no cache semantics to fight.
        //
        // The result is assigned on top of the prerendered data, and failures
        // are ignored on purpose: if Sanity is unreachable the already-rendered
        // content stays on screen rather than collapsing to an error.
        $sanityFresh.fetch(query, { currentPostDate, currentPostId, limit })
            .then((fresh) => {
                if (fresh) data.value = fresh
            })
            .catch(() => {})
    }

    return data
}
