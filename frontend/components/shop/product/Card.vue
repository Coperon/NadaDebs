<template>
    <div class="flex flex-col h-full relative">
        <NuxtLink :to="`/shop/${product?.store?.slug?.current}`" class="block w-full aspect-square">
            <CommonMediaImage v-if="product?.featuredImage" class="block w-full h-auto" :image="product?.featuredImage"
                :alt="product?.store?.title" width="700" height="700" mobileWidth="400" mobileHeight="400" />
        </NuxtLink>
        <div class="p-2 flex flex-col flex-1 justify-between gap-2">
            <div class="flex justify-between gap-2">
                <h2 class="uppercase">{{ product?.store?.title}}</h2>
                <ShopProductPrice :price="product?.store?.priceRange" />
            </div>
            <div class="flex justify-between gap-2" v-if="allowAddToCart && product?.store?.variants && product?.store?.variants?.length > 1">
                <ShopProductVariants 
                    :variants="product.store.variants" 
                    :selectedVariant="selectedVariant" 
                    @update:selectedVariant="selectedVariant = $event" 
                />
                <ShopAddToCart class="ml-auto mt-auto" :product="product" :selectedVariant="selectedVariant"/>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const props = defineProps({
    product: Object,
    allowAddToCart: {
        type: Boolean,
        default: false,
    },
})

const selectedVariant = ref('')
const siteSettingsData = inject('siteSettingsData')
const cartStore = useCartStore()

const infoIsOpen = ref(false)
</script>
