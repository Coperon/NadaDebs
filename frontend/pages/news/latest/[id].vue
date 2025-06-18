<template>
    <div class="pb-20 sm:pb-24 lg:pb-30">
        <CommonHero :cover="postData?.cover" :subtitle="'Latest News'" :title="postData?.title" />
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