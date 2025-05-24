<template>
    <div>
        <div 
            class="quote max-w-[48ch] text-balance mx-auto"
            :class="uppercase ? 'text-h3-upper-mobile sm:text-h3-upper uppercase' : 'text-h3-lower-mobile sm:text-h3-lower'"
        >
            <SanityContent :blocks="text" />
        </div>

        <div class="mt-5 text-a2 font-medium uppercase">Nada Debs</div>
    </div>
</template>

<script setup>
const props = defineProps({
    text: {
        type: Array,
        required: true,
    },
    uppercase: {
        type: Boolean,
        required: true,
        default: true
    }
})
</script>

<style scoped>
.quote:deep(strong) {
    font-weight: 700;
}
</style>