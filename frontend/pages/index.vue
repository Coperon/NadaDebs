<template>
    <div class="flex flex-1 flex-col gap-y-2 container">
        
        <template v-if="homeData?.content">
            <!-- Example of how to use portable text editor content strategy: -->
            <CommonBlockContent class="border p-4" :blocks="homeData?.content" title="" />
        </template>

        <template v-if="homeData?.pageBuilder">
            <!-- Example of how to use page builder content strategy: -->
            <CommonPageBuilder class="border p-4" :blocks="homeData?.pageBuilder" />
        </template>

    </div>
</template>

<script setup>
import { buildBodyClass } from '@/utils'
import { useSeoObject } from '@/composables/seo'
import { getHomepageData } from '@/data/homepage'
const route = useRoute()
const path = route.path
const bodyClass = buildBodyClass(path)

const homeData = await getHomepageData()

// add body class with usehead
useHead({
    bodyAttrs: {
        class: bodyClass,
    },
})

useSeoObject(homeData?.value?.seo, homeData?.value?.title)
</script>
