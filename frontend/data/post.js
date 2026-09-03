import groq from 'groq'
import { imageQuery, seoQuery } from "./fragments"

export const getPostBySlug = async postSlug => {
    const { $sanity, $sanityFresh } = useNuxtApp()
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
    const { data } = await useAsyncData(key, () =>
        $sanity.fetch(query, { postSlug: postSlug }),
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

    // Re-query Sanity in the browser so edits published since the last build
    // appear without a rebuild.
    //
    // This deliberately runs ON TOP of the prerendered payload rather than
    // replacing it. If the request fails — offline, Sanity outage, or the
    // origin missing from Sanity's CORS allowlist — the already-rendered
    // content stays on screen. Discarding it would collapse a perfectly good
    // page into the 404 thrown above.
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
        $sanityFresh.fetch(query, { postSlug: postSlug })
            .then((fresh) => {
                if (fresh) data.value = fresh
            })
            .catch(() => {})
    }

    return data
}
