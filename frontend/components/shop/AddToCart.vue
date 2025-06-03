<template>
    <button @click="handleClick($event)" @mouseenter="handleMouseEnter($event)" @mouseleave="showOptionsWarning = false" :disabled="isOutOfStock" class="btn w-fit h-fit uppercase">{{ isOutOfStock ? 'Sold out' :'Add to Cart'}}</button>
    <span v-if="showOptionsWarning" class="text-[#e17100] text-[14px]">Select your options</span>
</template>

<script setup>
const props = defineProps({
    product: Object,
    selectedVariant: Object,
    variantAvailability: Object,
    allVariantsUnavailable: Boolean, // <-- new prop
    variantAvailabilityLoading: Boolean // <-- add this line
})

const showOptionsWarning = ref(false)

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

const noVariantSelected = computed(() => {
    return (
        props?.product?.store?.variants?.length > 1 &&
        !props?.selectedVariant )
})

const isOutOfStock = computed(() => {
    const variant = getActiveVariant.value
    if (!variant) {
        // If no variant selected and multiple variants, only show Sold out if all variants are unavailable
        if (props.product?.store?.variants?.length > 1) {
            return props.allVariantsUnavailable
        }
        return true
    }
    // Use centralized availability
    if (props.variantAvailability && variant.store?.gid in props.variantAvailability) {
        return !props.variantAvailability[variant.store.gid]
    }
    // Fallback to static inventory if needed
    if (variant.store?.inventory && variant.store.inventory.management !== 'NOT_MANAGED' && variant.store.inventory.isAvailable === false) return true
    return false
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