<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem] pb-20 sm:pb-24 lg:pb-30">
        <CommonPageHeader 
            :title="awardsData?.title" 
            :description="awardsData?.description" 
        />

        <div class="flex flex-col gap-10 md:flex-row md:items-start xl:gap-[4.5rem]">
            <div v-if="awardsData?.image" class="relative overflow-hidden aspect-[3/4] md:aspect-auto md:w-1/2 md:h-svh md:sticky md:top-0">
                <CommonMediaImage
                    :image="awardsData?.image"
                    :alt="awardsData?.image?.alt"
                    width="768"
                    mobileWidth="768"
                    class="absolute inset-0 w-full h-full object-cover"
                />
            </div>

            <div v-if="awardsData?.awards && awardsData?.awards.length > 0" class="px-4 sm:px-6 lg:px-8 xl:px-12 md:w-1/2 max-w-[75ch]">
                <template v-for="(award, index) in awardsData.awards" :key="award._key">
                    <template v-if="index === 0 || award.year !== awardsData.awards[index - 1].year">
                        <h2 class="text-h1-mobile sm:text-h1 mt-10 first:mt-0">{{ award.year }}</h2>
                        <ul class="mt-2">
                            <li class="mt-2">
                                <div class="text-p1 font-medium">{{ award.title }}</div>
                                <div v-if="award.subtitle">{{ award.subtitle }}</div>
                            </li>
                            <template v-if="index < awardsData.awards.length - 1">
                                <li v-for="nextAward in awardsData.awards.slice(index + 1).filter(a => a.year === award.year)" :key="nextAward._key" class="mt-2">
                                    <div class="text-p1 font-medium">{{ nextAward.title }}</div>
                                    <div v-if="nextAward.subtitle">{{ nextAward.subtitle }}</div>
                                </li>
                            </template>
                        </ul>
                    </template>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getAwards } from '@/data/awards'

const awardsData = await getAwards()

useSeoObject(awardsData?.seo, awardsData?.title)
</script>