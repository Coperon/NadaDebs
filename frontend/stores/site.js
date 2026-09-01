// store.js
import { defineStore } from 'pinia'

export const useSiteStore = defineStore('site', {
    // Read from runtimeConfig rather than process.env. `process.env` is only
    // populated at build time, so it resolves correctly while prerendering but
    // is undefined when a route is rendered at runtime (ISR/SSR) — which
    // produced `<link rel="canonical" href="undefined/...">` on News pages.
    state: () => ({ url: useRuntimeConfig().public.publicSiteUrl }),
})
