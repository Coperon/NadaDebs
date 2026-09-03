import { createClient } from '@sanity/client'

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()

    // Default client. Honours runtimeConfig.public.sanity.useCdn, which is true
    // in production — fast, cached responses from apicdn.sanity.io.
    const client = createClient(config.public.sanity)

    // Second client that deliberately bypasses Sanity's API CDN.
    //
    // The CDN serves a cached response for a short window after a document is
    // published, so a browser refetch immediately after an edit can come back
    // with the previous value — which is precisely what the client-side News
    // refetch is trying to avoid. Sanity's own guidance is that the CDN suits
    // "frontends that serve end users" while the uncached API suits cases where
    // you must have the latest content.
    //
    // Used only for the client-side refetches in data/news.js, data/post.js and
    // data/newsPage.js. Everything else keeps the cached client.
    const freshClient = createClient({
        ...config.public.sanity,
        useCdn: false,
    })

    return {
        provide: {
            sanity: client,
            sanityFresh: freshClient,
        },
    }
})
