<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem]">
        <div class="py-20 sm:py-24 lg:py-30 px-4 sm:px-6 lg:px-8 xl:px-12">
            <div class="max-w-[75ch] mx-auto">
                <h1 class="text-h1-mobile sm:text-h1 uppercase text-center">{{ infoPageData?.title }}</h1>
                <div class="mt-12 rich-text">
                    <SanityContent :blocks="infoPageData?.content" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { getInfoPageBySlug } from '@/data/infoPage'

const route = useRoute()
const infoPageData = await getInfoPageBySlug(route.params.id)
</script>

<style scoped>
.rich-text:deep(* + *) {
    margin-top: 1.1875rem;
}

.rich-text:deep(h2 + *) {
    @apply mt-1.5;
}

.rich-text:deep(h2) {
    @apply text-a2-bold uppercase mt-8;
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