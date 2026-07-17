<template>
    <div class="price min-h-[1lh]">
        <div v-if="!loading && selectedVariant && selectedVariantPrice" class="flex gap-1">
            {{ formatPrice(selectedVariantPrice) }}
        </div>
        <div v-else-if="!loading && livePrice && livePrice.minVariantPrice && livePrice.maxVariantPrice && livePrice.minVariantPrice?.amount != livePrice.maxVariantPrice?.amount" class="flex gap-1">
            <span>{{ formatPrice(livePrice.minVariantPrice) }}</span>
            <span>-</span>
            <span>{{ formatPrice(livePrice.maxVariantPrice) }}</span>
        </div>
        <div
            v-else-if="!loading && livePrice && livePrice.minVariantPrice && livePrice.maxVariantPrice && livePrice.minVariantPrice?.amount == livePrice.maxVariantPrice?.amount"
        >
            {{ formatPrice(livePrice.minVariantPrice.amount) }}
        </div>
    </div>
</template>
<script setup>
import { fetchShopifyProductPrice, fetchVariantPrice } from '@/composables/shopify'
import { PRICE_COUNTRY_CODE } from '@/composables/countryCookie'

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

const livePrice = ref(props.price)
const selectedVariantPrice = ref(null)
const loading = ref(true)

async function updatePrice() {
    if (props.productGid) {
        loading.value = true
        
        if (props.selectedVariant?.store?.gid) {
            const variantPrice = await fetchVariantPrice(props.selectedVariant.store.gid, props.productGid, PRICE_COUNTRY_CODE)
            selectedVariantPrice.value = variantPrice
        } else {
            const newPrice = await fetchShopifyProductPrice(props.productGid, PRICE_COUNTRY_CODE)
            livePrice.value = newPrice || props.price
        }
        
        loading.value = false
    } else {
        livePrice.value = props.price
        selectedVariantPrice.value = null
        loading.value = false
    }
}

watch(() => props.productGid, updatePrice, { immediate: true })
watch(() => props.selectedVariant, updatePrice, { immediate: true })
</script>
