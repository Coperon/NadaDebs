<template>
    <div class="pb-20 sm:pb-24 lg:pb-30">
        <CommonHero :cover="postData?.cover" :subtitle="'Latest News'" :title="postData?.title" />
        <CommonPageHeader :title="postData?.title" :description="postData?.text" />
        <CommonContentGrid :content="postData?.content" />

        <div v-if="nextPosts && nextPosts.length > 0" class="mt-20 sm:mt-24 lg:mt-30">
            <CommonAsideHeading title="Continue reading" />
            <NewsGrid :posts="nextPosts" />
        </div>

        <div class="mt-20 sm:mt-24 lg:mt-30 flex justify-center">
            <NuxtLink to="/news/latest">
                <CommonButton isSecondary>
                    <div class="flex items-center gap-1.5">
                        <IconsArrow class="w-3 h-auto -scale-x-100" />
                        <span>Back to News</span>
                    </div>
                </CommonButton>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { useArticleSchema } from '@/composables/structuredData'
import { getPostBySlug } from '@/data/post'
import { getNextPosts } from '@/data/news'

const route = useRoute()
const postData = await getPostBySlug(route.params.id)

// Only fetch next posts if we have valid post data
const nextPosts = postData?.value ? await getNextPosts(postData.value.date, postData.value._id, 3) : null

definePageMeta({
    scrollToTop: true,
})

useSeoObject(
    postData?.value?.seo,
    postData?.value?.title,
    postData?.value?.cover || postData?.value?.thumbnail,
    'article',
)
useArticleSchema(postData?.value)
</script>