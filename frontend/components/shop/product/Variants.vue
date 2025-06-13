<template>
    <div v-if="variants && variants?.length > 1" class="relative text-[#4F4B4B] text-p2">
        <select
            :value="selectedVariant?.store?.gid"
            @change="handleVariantChange"
            class="appearance-none w-full bg-beige/30 h-10 pl-2.5 pr-8 cursor-pointer hover:bg-beige/50 transition-colors"
        >
            <option
                v-for="(variant, index) in variants"
                :key="variant._id"
                :value="variant?.store?.gid"
                
            >
                {{ variant.store.title }}
            </option>
        </select>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" class="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <path opacity="0.5" d="M0.834961 1L5.06474 5L9.29452 1" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </div>
</template>

<script setup>
const props = defineProps({
    variants: Array,
    selectedVariant: Object,
    productGid: String,
    variantAvailability: Object,
    variantAvailabilityLoading: Boolean
})

const handleVariantChange = (event) => {
    const selectedGid = event.target.value
    const selectedVariant = props.variants.find(
        variant => variant?.store?.gid === selectedGid
    )
    if (selectedVariant) {
        emit('update:selectedVariant', selectedVariant)
    }
}

const emit = defineEmits(['update:selectedVariant'])
</script>
