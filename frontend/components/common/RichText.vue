<template>
    <div class="rich-text">
        <SanityContent :blocks="blocks" />
    </div>
</template>

<script setup>
const props = defineProps({
    blocks: {
        type: Array,
        required: true
    }
})
</script>

<style scoped>
.rich-text:deep(* + *) {
    margin-top: 1.1875rem;
}

.rich-text:deep(h2) {
    @apply text-a2-bold uppercase mt-12;
}

.rich-text:deep(ul) {
    @apply list-disc pl-6;
}

.rich-text:deep(ol) {
    @apply list-decimal pl-6;
}

.rich-text:deep(li) {
    @apply mt-1.5;
}

.rich-text:deep(a) {
    @apply underline underline-offset-2;
}
</style>