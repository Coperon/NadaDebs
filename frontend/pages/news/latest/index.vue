<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem] pb-20 sm:pb-24 lg:pb-30">
        <CommonPageHeader 
            :title="newsPageData?.title" 
            :description="newsPageData?.description" 
        />

        <div v-if="newsData && newsData.length > 0">
            <NewsGrid :posts="newsData" />
        </div>
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getNewsPage } from '@/data/newsPage'
import { getNews } from '@/data/news'

const newsPageData = await getNewsPage()
const newsData = await getNews()

useSeoObject(newsPageData?.seo, newsPageData?.title)
</script>
