<template>
    <div class="price min-h-[1lh] text-p2">
        <template v-if="isHidden">
            <span>Price upon request</span>
        </template>
        <template v-else>
            <span v-if="hasVariants && countryStore?.country && livePrice && livePrice?.minVariantPrice && livePrice?.maxVariantPrice && livePrice?.minVariantPrice != livePrice?.maxVariantPrice">
                {{ formatPrice(livePrice.minVariantPrice, siteSettingsData?.currencyCode) }} - {{
                    formatPrice(livePrice.maxVariantPrice, siteSettingsData?.currencyCode) }}
            </span>
            <span class="relative"
                v-else-if="countryStore?.country">
                {{ formatPrice(livePrice.minVariantPrice, siteSettingsData?.currencyCode) }}
            </span>
        </template>
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
    },
    isHidden: {
        type: Boolean,
        required: false,
        default: false
    },
    hasVariants: {
        type: Boolean,
        required: false,
        default: false
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