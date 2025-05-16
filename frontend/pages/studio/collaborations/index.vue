<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem]">
        <header class="py-20 sm:py-25 lg:py-30 px-4 flex flex-col items-center text-center gap-6">
            <h1 class="text-h1 uppercase">{{ collaborationsPageData?.title }}</h1>
            <div class="max-w-[62ch] mx-auto">
                {{ collaborationsPageData?.description }}
            </div>
        </header>

        <div v-if="collaborationsData && collaborationsData.length > 0">
            <StudioGrid 
                :items="collaborationsData" 
                :showFeatured="true" 
                :isCollaboration="true" 
                :route="'/studio/collaborations'"
            />
        </div>
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getCollaborationsPage } from '@/data/collaborationsPage'
import { getCollaborations } from '@/data/collaborations'

const collaborationsPageData = await getCollaborationsPage()
const collaborationsData = await getCollaborations()

useSeoObject(collaborationsPageData?.seo, collaborationsPageData?.title)
</script>