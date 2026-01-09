/// <reference types="node" />

const sanityId = process.env.SANITY_PROJECT_ID
const sanityDataset = process.env.SANITY_PROJECT_DATASET
const sanityApiVersion = process.env.SANITY_API_VERSION
const isDev = process.env.APP_ENV == 'development'
const isProduction = process.env.APP_ENV == 'production'
const isPreview = process.env.APP_ENV == 'preview'

export default defineNuxtConfig({
    dev: isDev,
    devtools: { enabled: false },
    css: ['@/assets/styles/global.css'],
    /* TODO: Refactor to use the new preview mode for Nuxt 3 to improve consistency (so we can have server rendering for both previews and production) */
    ssr: !isPreview, // Use client rendering for preview mode to avoid caching issues
    app: {
        pageTransition: {
            name: 'page',
            mode: 'out-in',
        },
        head: {
            htmlAttrs: {
                lang: 'en',
            },
            link: [
                { rel: "stylesheet", href: "https://use.typekit.net/wyn2rmt.css" },
                // { rel: "dns-prefetch", href: "//player.vimeo.com" },
                // { rel: "preconnect", href: "//player.vimeo.com" },
            ],
        },
    },
    vite: {
        build: {
          minify: false
        }
    },
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
            'postcss-viewport-unit-fallback': {},
            'postcss-pxtorem': {
                replace: false,
                propList: [
                    'font',
                    'font-size',
                    'margin',
                    'margin-top',
                    'margin-right',
                    'margin-bottom',
                    'margin-left',
                    'padding',
                    'padding-top',
                    'padding-right',
                    'padding-bottom',
                    'padding-left',
                    'letter-spacing',
                    'width',
                    'height',
                    'max-width',
                    'max-height',
                    'row-gap',
                    'grid-gap',
                    'column-gap',
                    '!border-width',
                    '!border-radius',
                    '!border',
                    '!box-shadow',
                    'right',
                    'left',
                    'top',
                    'bottom',
                ],
            },
        },
    },
    plugins: [
        '~/plugins/initCountry.client.js',
        '~/plugins/sanity'
    ],
    modules: [
        // to allow stores (persistent states) to be used in the app
        '@pinia/nuxt',
        // to create and manage robots.txt file
        '@nuxtjs/robots',
        // to create and manage sitemap.xml file
        '@nuxtjs/sitemap',
        // to add custom fonts to the app from Google Fonts
        // you need to npm i @nuxtjs/google-fonts   
        // '@nuxtjs/google-fonts',
        '@nuxtjs/sanity',
    ],
    runtimeConfig: {
        public: {
            appEnv: process.env.APP_ENV,
            publicSiteUrl: process.env.NUXT_PUBLIC_SITE_URL,
            shopifyStoreDomain: process.env.SHOPIFY_STORE_DOMAIN,
            shopifyStorefrontAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
            sanity: {
                projectId: process.env.SANITY_PROJECT_ID,
                dataset: process.env.SANITY_PROJECT_DATASET,
                apiVersion: process.env.SANITY_API_VERSION || '2023-05-03',
                useCdn: isProduction
            }
        },
    },
    compatibilityDate: '2025-01-01',
})