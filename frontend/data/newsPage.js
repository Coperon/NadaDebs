import groq from 'groq'
import { seoQuery } from "./fragments"

export const getNewsPage = async () => {
    const { $sanity, $sanityFresh } = useNuxtApp()
    const query = groq` *[_id == "news"][0] {
        _id,
        title,
        description,
        seo {
            ${seoQuery}
        },
    }`
    const { data } = await useAsyncData('newsPage', () =>
        $sanity.fetch(query),
    )

    // Re-query in the browser so edits to the News page title/description
    // appear without a rebuild. See data/post.js for why failures are ignored.
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
