<template>
    <div class="article-body flex flex-col flex-1 w-full h-full gap-y-2">
        <div class="grid grid-cols-12 w-full">
            <div class="block col-span-12 lg:col-span-6 bg-gray">
                <CommonMediaImage v-if="productData?.featuredImage" class="block w-full h-auto"
                    :image="productData?.featuredImage" :alt="productData?.store?.title" width="700" height="700"
                    mobileWidth="400" mobileHeight="400" />
            </div>
            <div class="flex flex-col gap-y-4 p-2 h-full col-span-12 lg:col-span-6">
                <h1 class="uppercase">{{ productData?.store?.title }}</h1>
                <ShopProductPrice :price="productData?.store?.priceRange" />
                <div class="w-fit" v-if="productData.store.variants && productData.store.variants.length > 1">
                    <ShopProductVariants 
                        :variants="productData.store.variants" 
                        :selectedVariant="selectedVariant"
                        @update:selectedVariant="selectedVariant = $event" 
                    />
                </div>

                <ShopAddToCart :product="productData" :selectedVariant="selectedVariant" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { buildBodyClass } from '@/utils'
import { useSeoObject } from '@/composables/seo'
import { getProductBySlug } from '@/data/shop'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const routeName = route.name
const productData = await getProductBySlug(route.params.id)
const bodyClass = buildBodyClass(routeName)

const selectedVariant = ref('')
const siteSettingsData = inject('siteSettingsData')
const cartStore = useCartStore()

definePageMeta({
    layout: 'default',
    // Add scroll reset. By default nuxt does not reset scroll to top for child routes
    scrollToTop: true,
})

// add body class with usehead
useHead({
    bodyAttrs: {
        class: bodyClass,
    },
})
useSeoObject(
    productData?.value?.seo,
    productData?.value?.title || productData?.value?.store?.title,
    productData?.value?.featuredImage,
)
</script>
