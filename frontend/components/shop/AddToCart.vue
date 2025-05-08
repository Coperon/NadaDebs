<template>
    <button @click="addToCart(product, selectedVariant)" class="btn w-fit h-fit uppercase">Add to Cart</button>
</template>

<script setup>
const props = defineProps({
    product: Object,
    selectedVariant: String
})
</script>