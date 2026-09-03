/**
 * Re-query Sanity in the browser after a page has hydrated, so content
 * published since the last build appears without a Netlify rebuild.
 *
 * Call it immediately after a useAsyncData(...) that fetched from Sanity,
 * passing the same query and params:
 *
 *     const { data } = await useAsyncData('about', () => $sanity.fetch(query))
 *     liveRefetch(data, query)
 *
 * Design notes, all of which were learned the hard way:
 *
 *  - It does NOT use useAsyncData's refresh(). That helper short-circuits in
 *    several situations — while Nuxt is hydrating it returns the prerendered
 *    payload without invoking the handler at all, and resolves successfully,
 *    so it reports success while never contacting Sanity. A plain fetch has no
 *    cache semantics to work around.
 *
 *  - It uses $sanityFresh, not $sanity. $sanity honours useCdn, which is true
 *    in production, and apicdn.sanity.io serves a cached response for a short
 *    window after a publish — long enough that an editor refreshing straight
 *    after publishing still sees the old value. $sanityFresh sets useCdn:false.
 *
 *  - It runs ON TOP of the prerendered data and swallows errors deliberately.
 *    If Sanity is unreachable, or the origin is missing from Sanity's CORS
 *    allowlist, the already-rendered content stays on screen rather than
 *    disappearing. Never let a failed refresh be worse than no refresh.
 *
 *  - It is fire-and-forget: not awaited, and not wrapped in onMounted.
 *    onMounted must be registered synchronously during setup, and callers run
 *    it after `await useAsyncData`, by which point Vue has lost the active
 *    component instance — the hook would silently never register. Not awaiting
 *    also means the first paint still uses the prerendered data, so hydration
 *    matches the server HTML.
 *
 * @param {import('vue').Ref} data   the ref returned by useAsyncData
 * @param {string} query             the same GROQ query
 * @param {object} [params]          the same query params, if any
 */
export function liveRefetch(data, query, params) {
    if (!import.meta.client) return

    const { $sanityFresh } = useNuxtApp()

    $sanityFresh
        .fetch(query, params)
        .then((fresh) => {
            // Guard against null/undefined so a transient empty response can
            // never blank out a page that rendered correctly.
            if (fresh !== null && fresh !== undefined) {
                data.value = fresh
            }
        })
        .catch(() => {})
}
