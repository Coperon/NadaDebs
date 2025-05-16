<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem]">
        <article class="pb-12 xl:pb-0 xl:h-[calc(100vh-4.25rem)] xl:flex xl:overflow-auto">
            <div class="px-4 sm:px-6 lg:px-8 xl:px-12 pt-16 xl:py-8 flex flex-col gap-6 xl:w-[40vw] xl:shrink-0 xl:sticky xl:left-0">
                <h1 class="text-h2 uppercase flex flex-col gap-1.5">
                    <span class="font-light">Nada Debs x</span>
                    <span>{{ collaborationData?.title }}</span>
                </h1>

                <div v-if="collaborationData?.description" class="max-w-[62ch]">
                    {{ collaborationData?.description }}
                </div>

                <div v-if="collaborationData?.year" class="text-h2 flex flex-col gap-1.5 xl:mt-auto">
                    <span class="uppercase">Year</span>
                    <span class="font-light">{{ collaborationData?.year }}</span>
                </div>
            </div>

            <div v-if="collaborationData?.images && collaborationData?.images?.length > 0" class="mt-12 xl:mt-0 flex flex-col xl:flex-row gap-2.5 xl:shrink-0 xl:relative xl:bg-sand">
                <div v-for="image in collaborationData?.images" :key="image._key">
                    <CommonMediaImage
                        :image="image"
                        :alt="image.alt"
                        width="1536"
                        mobileWidth="768"
                        class="w-full h-auto xl:w-auto xl:h-full xl:shrink-0"
                    />
                </div>
            </div>
        </article>

        <aside v-if="collaborationData?.relatedCollaborations && collaborationData?.relatedCollaborations?.length > 0" class="pb-12">
            <div class="px-4 py-12">
                <h2 class="text-a2-bold uppercase text-center">Explore More</h2>
            </div>

            <div>
                <StudioGrid 
                    :items="collaborationData?.relatedCollaborations" 
                    :showFeatured="false" 
                    :isCollaboration="true" 
                    :route="'/studio/collaborations'"
                />
            </div>
        </aside>
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