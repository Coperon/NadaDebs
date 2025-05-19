<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem]">
        <CommonPageHeader 
            :title="collaborationsPageData?.title" 
            :description="collaborationsPageData?.description" 
        />

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