<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem] pb-20 sm:pb-24 lg:pb-30">
        <CommonPageHeader 
            :title="pressData?.title" 
            :description="pressData?.description" 
        />

        <div v-if="pressData?.articles && pressData?.articles.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-x-2 gap-y-8 sm:gap-y-12">
            <div v-for="article in pressData?.articles" :key="article._key">
                <a 
                    v-if="article.type === 'pdf' && article.pdf" 
                    :href="article.pdf"
                    target="_blank"
                >
                    <PressCard :date="article.date" :image="article.image" />
                </a>
                <a 
                    v-else-if="article.type === 'link' && article.link" 
                    :href="article.link"
                    target="_blank"
                >
                    <PressCard :date="article.date" :image="article.image" />
                </a>
                <div v-else>
                    <PressCard :date="article.date" :image="article.image" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getPress } from '@/data/press'

const pressData = await getPress()

useSeoObject(pressData?.value?.seo, pressData?.value?.title)
</script>