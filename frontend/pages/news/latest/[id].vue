<template>
    <div :class="{ 'pt-[3.25rem] sm:pt-[4.25rem]': !postData?.cover }">
        <div v-if="postData?.cover" class="h-svh relative overflow-hidden">
            <CommonMediaImage
                :image="postData?.cover"
                :alt="postData?.cover?.alt"
                width="1536"
                mobileWidth="768"
                class="absolute inset-0 w-full h-full object-cover"
            />

            <div class="absolute inset-0 flex items-center justify-center text-center p-4 sm:p-6 lg:p-8 xl:p-12 bg-black/30 text-white">
                <div class="flex flex-col gap-3 sm:gap-4 lg:gap-6">
                    <div class="text-a2 uppercase">Latest News</div>
                    <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.05em] uppercase">{{ postData?.title }}</h1>
                </div>
            </div>
        </div>

        <CommonPageHeader :title="postData?.title" :description="postData?.text" />

        <CommonContentGrid :content="postData?.content" />
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getPostBySlug } from '@/data/post'

const route = useRoute()
const postData = await getPostBySlug(route.params.id)

definePageMeta({
    scrollToTop: true,
})

useSeoObject(
    postData?.value?.seo,
    postData?.value?.title,
    postData?.value?.cover || postData?.value?.thumbnail,
)
</script>