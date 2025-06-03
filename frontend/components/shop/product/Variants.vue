<template>
    <div v-if="variants && variants?.length > 1" class="flex gap-2">
        <template v-for="(variant, index) in variants" :key="variant._id">
            <input
                type="radio"
                :id="`radio-${index}-${variant._id}`"
                :name="`variant-${variant?.store?.id}`"
                :value="variant?.store?.gid"
                :checked="
                    selectedVariant &&
                    selectedVariant?.store?.gid === variant?.store?.gid
                "
                @change="$emit('update:selectedVariant', variant)"
                @click="$emit('update:selectedVariant', variant)"
                class="hidden"
            />
           <ShopProductVariant
                :variant="variant"
                :index="index"
                :selectedVariant="selectedVariant"
                :productGid="productGid"
            />
        </template>
    </div>
</template>

<script setup>
const props = defineProps({
    variants: Array,
    selectedVariant: Object,
    productGid: String
})
</script>
