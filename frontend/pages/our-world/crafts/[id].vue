<template>
    <div>
        <div class="h-svh relative overflow-hidden">
            <CommonMediaImage
                :image="craftData?.cover"
                :alt="craftData?.cover?.alt"
                width="1536"
                mobileWidth="768"
                class="absolute inset-0 w-full h-full object-cover"
            />

            <div class="absolute top-30 left-0 px-[2.125rem] w-full max-w-md sm:left-12 sm:px-0 md:left-20 lg:left-30">
                <div class="flex gap-2">
                    <div v-if="craftData?.thumbnail?.image" class="w-2/5 xl:w-1/2 aspect-[23/29] shrink-0 relative">
                        <div class="relative overflow-hidden h-full">
                            <CommonMediaImage
                                :image="craftData?.thumbnail?.image"
                                :alt="craftData?.title"
                                width="384"
                                mobileWidth="384"
                                class="absolute inset-0 w-full h-full object-cover"
                            />
                            <video
                                v-if="craftData?.thumbnail?.video"
                                ref="thumbnailVideoRef"
                                muted
                                loop
                                autoplay
                                playsinline
                                :src="craftData?.thumbnail?.video"
                                class="absolute inset-0 w-full h-full object-cover"
                                :class="{ 'opacity-0': !canAutoplay }"
                            />
                        </div>

                        <div class="absolute bottom-4 left-0 -translate-x-1/2 w-9 sm:w-12 xl:w-16 h-auto text-primary-button">
                            <IconsDots class="w-full h-auto" />
                        </div>
                    </div>

                    <div class="w-3/5 xl:w-1/2">
                        <h1 class="text-h2">{{ craftData?.title }}</h1>
                        <div v-if="craftData?.briefDescription" class="text-p2 mt-2 line-clamp-5">
                            {{ craftData?.briefDescription }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <CommonPageHeader :title="'About ' + craftData?.title" :description="craftData?.description" />

        <CommonContentGrid :content="craftData?.content" />
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getCraftBySlug } from '@/data/craft'

const route = useRoute()
const craftData = await getCraftBySlug(route.params.id)

definePageMeta({
    scrollToTop: true,
})

useSeoObject(
    craftData?.value?.seo,
    craftData?.value?.title,
    craftData?.value?.cover,
)

// Handle thumbnail video
const thumbnailVideoRef = ref(null)
const { canAutoplay } = useVideoAutoplay(thumbnailVideoRef)
</script>