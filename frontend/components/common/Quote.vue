<template>
    <div>
        <div class="quote text-h3-upper-light uppercase max-w-[48ch] text-balance mx-auto">
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
})
</script>

<style scoped>
.quote:deep(strong) {
    font-weight: 700;
}
</style>