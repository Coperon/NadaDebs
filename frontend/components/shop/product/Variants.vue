<template>
    <div v-if="variants && variants?.length > 1" class="flex gap-2">
        <template v-for="(variant, index) in variants" :key="variant._id">
            <input type="radio" :id="`radio-${index}-${variant._id}`" :name="`variant-${variant?.store?.id}`"
                :value="variant?.store?.gid" :checked="selectedVariant === variant?.store?.gid"
                @change="$emit('update:selectedVariant', variant?.store?.gid)" class="hidden">
            <label :for="`radio-${index}-${variant._id}`"
                class="tab transition-colors flex justify-center p-2 min-w-[40px] border rounded-full cursor-pointer hover:text-[#929292]"
                :class="{ 'text-blue': selectedVariant === variant?.store?.gid, 'bg-white text-black': selectedVariant !== variant?.store?.gid }">
                {{ variant.store.title }}
            </label>

        </template>
    </div>
</template>

<script setup>
const props = defineProps({
    variants: Array,
    selectedVariant: String,
})  
</script>