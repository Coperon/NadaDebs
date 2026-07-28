<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem] xl:pt-0 flex flex-col gap-20 sm:gap-24 lg:gap-30">

        <!-- Back button -->
        <CommonBackButton defaultBackRoute="/studio/collaborations" />

        <!-- Collaboration content -->
        <StudioProject
            :title="collaborationData?.title"
            :description="collaborationData?.description"
            :year="collaborationData?.year"
            :images="collaborationData?.images"
            :inquireUrl="collaborationData?.inquireUrl"
            :isCollaboration="true"
        />

        <StudioRelated
            v-if="collaborationData?.relatedCollaborations"
            :relatedProjects="collaborationData?.relatedCollaborations"
            :isCollaboration="true"
            :route="'/studio/collaborations'"
        />
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getCollaborationBySlug } from '@/data/collaboration'

const route = useRoute()
const collaborationData = await getCollaborationBySlug(route.params.id)

definePageMeta({
    scrollToTop: true,
})

useSeoObject(
    collaborationData?.value?.seo,
    collaborationData?.value?.title,
    collaborationData?.value?.featuredImage,
)
</script>