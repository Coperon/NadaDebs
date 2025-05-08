<template>
    <div class="flex flex-col flex-1 container">
        <CommonBlockContent class="border p-4" :blocks="aboutData?.content" />
    </div>  
</template>

<script setup>
import { buildBodyClass } from '@/utils'
import { useSeoObject } from '@/composables/seo'
import { getAboutData } from '@/data/about'
const route = useRoute()
const path = route.path
const bodyClass = buildBodyClass(path)

const aboutData = await getAboutData()

// add body class with usehead
useHead({
    bodyAttrs: {
        class: bodyClass,
    },
})
useSeoObject(aboutData?.value?.seo, aboutData?.value?.title)
</script>
