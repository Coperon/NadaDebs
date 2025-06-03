<template>
    <div class="price min-h-[1lh]">
        <span v-if="countryStore.country && livePrice && livePrice.minVariantPrice && livePrice.maxVariantPrice && livePrice.minVariantPrice?.amount != livePrice.maxVariantPrice?.amount">
            {{ formatPrice(livePrice.minVariantPrice, siteSettingsData?.currencyCode) }} - {{
                formatPrice(livePrice.maxVariantPrice, siteSettingsData?.currencyCode) }}
        </span>
        <span class="relative"
            v-else-if="countryStore.country">
            {{ formatPrice(livePrice.minVariantPrice, siteSettingsData?.currencyCode) }}
        </span>
    </div>
</template>
<script setup>
import { fetchShopifyProductPrice } from '@/composables/shopify'

const props = defineProps({
    price: {
        type: Object,
        required: false,
        default: null
    },
    productGid: {
        type: String,
        required: false,
        default: null
    }
})

const siteSettingsData = inject('siteSettingsData')
const countryStore = useCountryStore()
const livePrice = ref(props.price)

async function updatePrice() {
    if (props.productGid && countryStore.country) {
        const newPrice = await fetchShopifyProductPrice(props.productGid, countryStore.country)
        livePrice.value = newPrice || props.price
    } else {
        livePrice.value = props.price
    }
}

watch(() => countryStore.country, updatePrice, { immediate: true })
</script>