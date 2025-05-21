<template>
    <div class="px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col gap-6 max-w-[75ch] lg:max-w-[100ch] mx-auto">
        <h2 v-if="title" class="text-h1-mobile sm:text-h1 uppercase text-center">{{ title }}</h2>
        <div v-if="text" class="rich-text sm:text-center">
            <SanityContent :blocks="text" />
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        required: false,
    },
    text: {
        type: Array,
        required: false,
    },
})
</script>

<style scoped>
.rich-text:deep(p + p) {
    margin-top: 1.1875rem;
}
</style>