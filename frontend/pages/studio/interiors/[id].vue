<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem] xl:pt-0">
        <StudioProject
            :title="interiorData?.title"
            :description="interiorData?.description"
            :location="interiorData?.location"
            :year="interiorData?.year"
            :images="interiorData?.images"
            :isCollaboration="false"
        />

        <StudioRelated
            v-if="interiorData?.relatedProjects"
            :relatedProjects="interiorData?.relatedProjects"
            :isCollaboration="false"
            :route="'/studio/interiors'"
        />
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getInteriorBySlug } from '@/data/interior'

const route = useRoute()
const interiorData = await getInteriorBySlug(route.params.id)

definePageMeta({
    scrollToTop: true,
})

useSeoObject(
    interiorData?.value?.seo,
    interiorData?.value?.title,
    interiorData?.value?.featuredImage,
)
</script>