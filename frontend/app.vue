<template>
    <Html class="text-base">
        <Body class="antialiased font-default bg-sand text-black text-p1 font-light">
            <NuxtLoadingIndicator
                :throttle="200"
                :height="3"
                :color="'#a2a2a2'"
            />
            <div id="__layout">
                <NuxtLayout>
                    <NuxtPage />
                </NuxtLayout>
            </div>
        </Body>
    </Html>
</template>

<script setup>
import { siteSettings } from '@/data/siteSettings'
import { getFileExtension } from '@/utils'
// import { initShopify } from './composables/shopify'
let siteSettingsData = await siteSettings()
const runtimeConfig = useRuntimeConfig()
const isProduction = runtimeConfig?.public?.appEnv === 'production'
const siteUrlIsValid = runtimeConfig?.public?.publicSiteUrl && !runtimeConfig?.public?.publicSiteUrl.includes('netlify.app') && !runtimeConfig?.public?.publicSiteUrl.includes('vercel.app') && !runtimeConfig?.public?.publicSiteUrl.includes('pages.dev')
const shouldIndexFollow = isProduction && siteUrlIsValid
const nuxtApp = useNuxtApp()
const route = useRoute()
const previousRouteStore = usePreviousRouteStore()
nuxtApp.hook('page:start', () => {
    previousRouteStore.name = route?.name
})
const favicon = siteSettingsData?.value?.siteFavicon?.asset?.url
    ? siteSettingsData?.value?.siteFavicon?.asset?.url
    : '/favicon.png'
const faviconType = getFileExtension(favicon)

// Google Tag Manager ID. Update environment variable in .env file to enable GTM.
const gtmID = siteSettingsData?.value?.gtmID

// const shopiClient = await initShopify()


provide('siteSettingsData', siteSettingsData)


useHead({
    meta: [
        
        {
            name: 'robots',
            content: shouldIndexFollow ? 'index, follow' : 'noindex, nofollow',
        },
    ],
    link: [
        {
            rel: 'icon',
            type: `image/${faviconType}`,
            href: `${favicon}?w=100&h=100`,
        },
        // example of custom font preloading to avoid initial fOUC when loading the page
        // {
        //     rel: 'preload',
        //     href: '/fonts/ABCDiatype-Regular-Trial.woff2',
        //     crossorigin: '',
        //     as: 'font',
        //     type: 'font/woff2',
        // },
    ],
    noscript: gtmID
        ? [
              {
                  hid: 'gtm',
                  children: `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmID}" height="0" width="0"
        style="display:none;visibility:hidden"></iframe>`,
                  'data-analytics-type': 'gtm',
                  'data-cookiecategory': 'analytics',
                  body: true,
              },
          ]
        : [],
    script: gtmID
        ? [
              {
                  src: '/js/analytics.js',
                  type: 'text/plain',
                  'data-analytics-type': 'gtm',
                  'data-category': 'analytics',
                  'data-gtmid': gtmID,
                  body: false,
              },
          ]
        : [],
})
</script>

<style>
/* Page transitions */
.page-enter-active,
.page-leave-active,
.layout-enter-active,
.layout-leave-active {
    @apply transition-all duration-200;
}

.page-enter-from,
.page-leave-to,
.layout-enter-from,
.layout-leave-to {
    @apply opacity-0;
}
</style>
