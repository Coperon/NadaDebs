<template>
    <section class="products grid grid-cols-12 bg-white">
        <article v-for="product in products" :key="product._id"
            class="project group flex flex-col"
            :class="{
                'col-span-6 md:col-span-4': columns === '3',
                'col-span-6': columns === '2',
            }"
        >
            <ShopProductCard :product="product" />
        </article>
    </section>
</template>

<script setup>
const props = defineProps({
    products: {
        type: Array,
        required: true,
    },
    columns: {
        type: String,
        default: '2',
    }
})
</script>