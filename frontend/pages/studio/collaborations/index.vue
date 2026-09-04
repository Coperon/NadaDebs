<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem] pb-20 sm:pb-24 lg:pb-30">
        <CommonPageHeader 
            :title="collaborationsPageData?.title" 
            :description="collaborationsPageData?.description" 
            :button="{
                text: 'Inquire',
                link: '/connect/contact-us',
            }"
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

useSeoObject(collaborationsPageData?.value?.seo, collaborationsPageData?.value?.title)
</script>