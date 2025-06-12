<template>
    <label
        :for="`radio-${index}-${variant._id}`"
        class="cursor-pointer text-p2 lowercase flex items-center gap-2"
        :class="
            selectedVariant && selectedVariant?.store?.gid === variant?.store?.gid ? 'font-medium' : 'font-light'
            // 'font-medium': selectedVariant && selectedVariant?.store?.gid === variant?.store?.gid,
            // 'font-light': selectedVariant?.store?.gid !== variant?.store?.gid && !isAvailable
            // 'cursor-not-allowed opacity-30 pointer-events-none': !isAvailable
        "
    >
        <span 
            class="w-3 h-3 rounded-full border flex items-center justify-center shrink-0"
            :class="selectedVariant && selectedVariant?.store?.gid === variant?.store?.gid ? 'border-black' : 'border-grey'"
        >
            <span 
                class="w-1.5 h-1.5 rounded-full bg-black transition-opacity duration-300"
                :class="selectedVariant && selectedVariant?.store?.gid === variant?.store?.gid ? 'opacity-100' : 'opacity-0'"
            ></span>
        </span>
        <span>{{ variant.store.title }}</span>
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