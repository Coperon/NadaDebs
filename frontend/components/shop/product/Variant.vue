<template>
    <label
        :for="`radio-${index}-${variant._id}`"
        class="tab transition-colors flex justify-center p-2 min-w-[40px] border border-black rounded-full cursor-pointer"
        :class="{
            'bg-black text-white': selectedVariant && selectedVariant?.store?.gid === variant?.store?.gid,
            'bg-white hover:text-blue-700':
                selectedVariant?.store?.gid !== variant?.store?.gid && !isOutOfStock,
            'cursor-not-allowed line-through opacity-50 pointer-events-none': isOutOfStock
        }"
    >
        {{ variant.store.title }}
    </label>
</template>

<script setup>
// NOTE: All market/location-aware availability logic is now centralized in AddToCart.vue.
// This component only displays the variant label and selection UI.

const props = defineProps({
    variant: Object,
    index: Number,
    selectedVariant: Object,
    isAvailable: {
        type: Boolean,
        default: true
    },
    productGid: {
        type: String,
        required: false,
        default: null
    }
})

// Remove all fetch and computed logic related to availability

</script>