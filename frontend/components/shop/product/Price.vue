<template>
    <div class="price min-h-[1lh]">
        <div v-if="!loading && countryStore.country && selectedVariant && selectedVariantPrice" class="flex gap-1">
            {{ formatPrice(selectedVariantPrice, siteSettingsData?.currencyCode) }}
        </div>
        <div v-else-if="!loading && countryStore.country && livePrice && livePrice.minVariantPrice && livePrice.maxVariantPrice && livePrice.minVariantPrice?.amount != livePrice.maxVariantPrice?.amount" class="flex gap-1">
            <span>{{ formatPrice(livePrice.minVariantPrice, siteSettingsData?.currencyCode) }}</span>
            <span>-</span>
            <span>{{ formatPrice(livePrice.maxVariantPrice, siteSettingsData?.currencyCode) }}</span>
        </div>
        <div
            v-else-if="!loading && countryStore.country && livePrice && livePrice.minVariantPrice && livePrice.maxVariantPrice && livePrice.minVariantPrice?.amount == livePrice.maxVariantPrice?.amount"
        >
            {{ formatPrice(livePrice.minVariantPrice.amount, siteSettingsData?.currencyCode)}}
        </div>
    </div>
</template>
<script setup>
import { fetchShopifyProductPrice, fetchVariantPrice } from '@/composables/shopify'

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
    selectedVariant: {
        type: Object,
        required: false,
        default: null
    },
})

const siteSettingsData = inject('siteSettingsData')
const countryStore = useCountryStore()
const livePrice = ref(props.price)
const selectedVariantPrice = ref(null)
const loading = ref(true)

async function updatePrice() {
    if (props.productGid && countryStore.country) {
        loading.value = true
        
        if (props.selectedVariant?.store?.gid) {
            const variantPrice = await fetchVariantPrice(props.selectedVariant.store.gid, props.productGid, countryStore.country)
            selectedVariantPrice.value = variantPrice
        } else {
            const newPrice = await fetchShopifyProductPrice(props.productGid, countryStore.country)
            livePrice.value = newPrice || props.price
        }
        
        loading.value = false
    } else {
        livePrice.value = props.price
        selectedVariantPrice.value = null
        loading.value = false
    }
}

watch(() => countryStore.country, updatePrice, { immediate: true })
watch(() => props.selectedVariant, updatePrice, { immediate: true })
</script>