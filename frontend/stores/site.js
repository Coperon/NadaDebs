// store.js
import { defineStore } from 'pinia'
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL

export const useSiteStore = defineStore('site', {
    state: () => ({ url: siteUrl }),
})
