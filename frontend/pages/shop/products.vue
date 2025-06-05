<template>
    <section class="projects grid grid-cols-12 gap-2">
        <article
            v-for="product in productsData"
            :key="product._id"
            class="project col-span-6 md:col-span-4 group flex flex-col border"
        >  
            <Card :product="product" :allowAddToCart="false" />
        </article>
    </section>
</template>

<script setup>
import { buildBodyClass } from '@/utils'
import { useSeoObject } from '@/composables/seo'
import { getProducts } from '@/data/shop'
import Card from '@/components/shop/product/Card.vue'

const route = useRoute()
const path = route.path

const productsData = await getProducts()
const bodyClass = buildBodyClass(path)

useHead({
    bodyAttrs: {
        class: bodyClass,
    },
})

useSeoObject(
    productsData?.value?.seo,
    productsData?.value?.title || 'Shop',
    productsData?.value?.featuredImage,
)
</script>
