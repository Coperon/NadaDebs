<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem] xl:pt-0 pb-20 sm:pb-24 lg:pb-30">
        <StudioProject
            :title="collaborationData?.title"
            :description="collaborationData?.description"
            :year="collaborationData?.year"
            :images="collaborationData?.images"
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