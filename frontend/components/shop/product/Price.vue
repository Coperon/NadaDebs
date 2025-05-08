<template>
    <div class="price">
        <span
            v-if="price?.minVariantPrice && price?.maxVariantPrice && price?.minVariantPrice != price?.maxVariantPrice">
            {{ formatPrice(price?.minVariantPrice, siteSettingsData?.currencyCode) }} - {{
                formatPrice(price?.maxVariantPrice, siteSettingsData?.currencyCode) }}
        </span>
        <span class="relative"
            v-else-if="price?.minVariantPrice || price?.minVariantPrice == price?.maxVariantPrice">
            {{ formatPrice(price?.minVariantPrice, siteSettingsData?.currencyCode) }}
        </span>
    </div>
</template>
<script setup>
const props = defineProps({
    price: {
        type: Object,
        required: true,
    },
})

const siteSettingsData = inject('siteSettingsData')
</script>