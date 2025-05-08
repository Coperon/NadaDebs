<template>
    <figure class="w-auto flex gap-x-2 items-center">
        <div class="logo-wrapper max-h-full h-[2em]" v-html="siteLogo"></div>
        <figcaption v-if="siteName" class="hidden sm:block">{{ siteName }}</figcaption>
    </figure>
</template>

<script setup>
const props = defineProps({
    siteName: String,
    siteLogo: String,
})
</script>

<style scoped>
.logo-wrapper :deep(svg) {
   @apply h-full w-auto;
}
</style>
