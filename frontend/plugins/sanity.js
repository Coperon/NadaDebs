import { createClient } from '@sanity/client'

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()
    const client = createClient(config.public.sanity)

    return {
        provide: {
            sanity: client
        }
    }
})
