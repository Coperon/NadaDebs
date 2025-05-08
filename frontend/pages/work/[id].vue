<template>
    <div class="article-body flex flex-col flex-1 h-full gap-y-2">
        <CommonBackButton class="uppercase text-right">Back to archive</CommonBackButton>
        <CommonBlockContent
            :blocks="projectData?.content"
            :title="projectData?.title"
            class="container border p-4"
        />
    </div>
</template>

<script setup>
import { buildBodyClass } from '@/utils'
import { useSeoObject } from '@/composables/seo'
import { getProjectBySlug } from '@/data/project'
const route = useRoute()
const routeName = route.name
const projectData = await getProjectBySlug(route.params.id)
const bodyClass = buildBodyClass(routeName)
definePageMeta({
    layout: 'default',
    // Add scroll reset. By default nuxt does not reset scroll to top for child routes
    scrollToTop: true,
})

// add body class with usehead
useHead({
    bodyAttrs: {
        class: bodyClass,
    },
})
useSeoObject(
    projectData?.value?.seo,
    projectData?.value?.title,
    projectData?.value?.featuredImage,
)
</script>
