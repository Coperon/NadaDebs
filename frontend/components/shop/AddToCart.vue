<template>
    <button @click="handleClick($event)" @mouseenter="handleMouseEnter($event)" @mouseleave="showOptionsWarning = false" :disabled="isOutOfStock" class="btn w-fit h-fit uppercase">{{ isOutOfStock ? 'Sold out' :'Add to Cart'}}</button>
    <span v-if="showOptionsWarning" class="text-[#e17100] text-[14px]">Select your options</span>
</template>

<script setup>
import { fetchVariantAvailability } from '@/composables/shopify'

const props = defineProps({
    product: Object,
    selectedVariant: Object
})

const countryStore = useCountryStore()
const showOptionsWarning = ref(false)
const marketAvailable = ref(null)

// Centralized function to get the variant to check (single or selected)
const getActiveVariant = computed(() => {
    if (props.product?.store?.variants?.length === 1) {
        return props.product.store.variants[0]
    }
    if (props.selectedVariant) {
        return props.selectedVariant
    }
    return null
})

// Centralized market-aware availability check
async function checkMarketAvailability() {
    const variant = getActiveVariant.value
    if (variant && variant.store?.gid && props.product?.store?.gid && countryStore.country) {
        try {
            const available = await fetchVariantAvailability(variant.store.gid, props.product.store.gid, countryStore.country)
            marketAvailable.value = available
        } catch (e) {
            marketAvailable.value = null
        }
    } else {
        marketAvailable.value = null
    }
}

watch(() => [countryStore.country, getActiveVariant.value?.store?.gid], checkMarketAvailability, { immediate: true })
onMounted(checkMarketAvailability)

const noVariantSelected = computed(() => {
    return (
        props?.product?.store?.variants?.length > 1 &&
        !props?.selectedVariant )
})

const isOutOfStock = computed(() => {
    // No variants at all
    if (!props.product?.store?.variants || props.product.store.variants.length === 0) return true;

    // If no variant selected and multiple variants, do NOT show Sold out (let user select)
    if (props.product.store.variants.length > 1 && !props.selectedVariant) return false;

    // Use marketAvailable if set (true/false)
    if (marketAvailable.value === false || marketAvailable.value === undefined) return true;
    if (marketAvailable.value === true) return false;

    // Fallback to static inventory if marketAvailable is null
    const variant = getActiveVariant.value
    if (variant && variant.store?.inventory && variant.store.inventory.management !== 'NOT_MANAGED' && variant.store.inventory.isAvailable === false) return true;
    return false;
})

const handleClick = (event) => {
    event.preventDefault()
    if (isOutOfStock.value || noVariantSelected.value) {
        // Optionally show a warning or feedback here
        return false
    }
    addToCart(props.product, getActiveVariant.value?.store?.gid)
}

const handleMouseEnter = (event) => {
    if (noVariantSelected.value) {
        showOptionsWarning.value = true
    } else {
        showOptionsWarning.value = false
    }
}
</script>