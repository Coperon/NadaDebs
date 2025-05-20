<template>
    <div>
        {{ aboutData?.title }}
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getAboutData } from '@/data/about'

const aboutData = await getAboutData()

useSeoObject(aboutData?.seo, aboutData?.title)
</script>