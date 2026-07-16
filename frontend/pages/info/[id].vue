<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem]">
        <div class="py-20 sm:py-24 lg:py-30 px-4 sm:px-6 lg:px-8 xl:px-12">
            <div class="max-w-[75ch] mx-auto">
                <h1 class="text-a1-bold uppercase text-center">{{ infoPageData?.title }}</h1>
                <div class="mt-10">
                    <CommonRichText :blocks="infoPageData?.content" />
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