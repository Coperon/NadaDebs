<template>
    <div>
        <div v-if="!product?.buyOptions?.onlyInquire" class="text-a2 text-grey lowercase mb-2">
            <template v-if="isOutOfStock && !product?.buyOptions?.inquireWhenOutOfStock">
                Sold out
            </template>
            <template v-else-if="product?.store?.variants?.length > 1 && !selectedVariant">
                Please select a variant
            </template>
            <template v-else-if="product?.store?.variants?.length > 1 && selectedVariant">
                {{ isOutOfStock ? 'Sold out' : 'In stock' }}
            </template>
        </div>

        <button 
            v-if="product?.buyOptions?.onlyInquire || (product?.buyOptions?.inquireWhenOutOfStock && isOutOfStock)" 
            class="w-full"
            :class="{'opacity-50 pointer-events-none cursor-not-allowed': product?.store?.variants?.length > 1 && !selectedVariant}"
            :disabled="product?.store?.variants?.length > 1 && !selectedVariant"
        >
            <CommonButton>Inquire</CommonButton>
        </button>

        <button 
            v-else-if="!isOutOfStock" 
            class="w-full"
            @click="handleClick($event)"
            :class="{'opacity-50 pointer-events-none cursor-not-allowed': product?.store?.variants?.length > 1 && !selectedVariant}"
        >
            <CommonButton>Add to Cart</CommonButton>
        </button>

        
        <!-- <button 
            @click="handleClick($event)" 
            @mouseenter="handleMouseEnter($event)" 
            @mouseleave="showOptionsWarning = false" 
            :disabled="isOutOfStock"
        >
            <CommonButton>
                {{ isOutOfStock ? 'Sold out' :'Add to Cart'}}
            </CommonButton>
        </button> -->
    </div>
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
</script>