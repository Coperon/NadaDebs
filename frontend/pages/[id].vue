<template>
    <div class="page-body flex flex-col flex-1 h-full gap-y-2 container">
        <CommonBlockContent
            class="border p-4"
            :blocks="pageData?.content"
            :title="pageData?.title"
        />
    </div>
</template>

<script setup>
import { buildBodyClass } from '@/utils'
import { useSeoObject } from '@/composables/seo'
import { getPageBySlug } from '../data/page'

const path = useRoute().path
const bodyClass = buildBodyClass(path)
const route = useRoute()

const pageData = await getPageBySlug(route.params.id)

useHead({
    bodyAttrs: {
        class: bodyClass,
    },
})

useSeoObject(pageData?.value?.seo, pageData?.value?.title)
</script>
