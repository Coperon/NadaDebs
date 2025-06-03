<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem] pb-20 sm:pb-24 lg:pb-30">
        <CommonPageHeader 
            :title="newsPageData?.title" 
            :description="newsPageData?.description" 
        />

        <div v-if="newsData && newsData.length > 0">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 md:gap-y-12 xl:gap-y-16 gap-x-2.5 pb-12">
                <div v-for="post in newsData" :key="post._id">
                    <NuxtLink :to="`/news/latest/${post.slug.current}`">
                        <div class="relative overflow-hidden aspect-[3/2]">
                            <CommonMediaImage
                                :image="post.thumbnail"
                                :alt="post.title"
                                width="512"
                                mobileWidth="384"
                                class="w-full h-full object-cover"
                            />
                        </div>

                        <div class="px-4 mt-2.5 lg:mt-5">
                            <h2 class="text-h2 uppercase flex flex-col gap-1.5">{{ post.title }}</h2>

                            <div v-if="post.date" class="text-p2 mt-1.5 opacity-30">
                                {{ formatDate(post.date) }}
                            </div>

                            <div v-if="post.text" class="text-p2 mt-1.5 line-clamp-2">
                                {{ post.text }}
                            </div>
                        </div>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getNewsPage } from '@/data/newsPage'
import { getNews } from '@/data/news'

const newsPageData = await getNewsPage()
const newsData = await getNews()

const { formatDate } = useDateFormat()

useSeoObject(newsPageData?.seo, newsPageData?.title)
</script>
