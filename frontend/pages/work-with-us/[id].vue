<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem]">
        <div class="py-20 sm:py-24 lg:py-30">
            <CareersTable :positions="[positionData]" isSingle />

            <div class="mt-10 flex flex-col gap-20 lg:flex-row lg:items-start lg:gap-16 lg:mt-16 xl:gap-30">
                <div v-if="positionData?.image" class="aspect-square relative overflow-hidden sm:aspect-[3/2] lg:aspect-[3/4] lg:w-2/5 xl:w-1/3">
                    <CommonMediaImage
                        :image="positionData?.image"
                        :alt="positionData?.image?.alt"
                        width="512"
                        mobileWidth="768"
                        class="absolute inset-0 w-full h-full object-cover"
                    />
                </div>

                <div class="lg:w-3/5 xl:w-2/3">
                    <div class="px-4 sm:px-6 lg:pr-8 lg:pl-0 xl:pr-12">
                        <div class="max-w-[75ch] mx-auto lg:mx-0">
                            <h2 class="text-h1-mobile sm:text-h1 uppercase text-center lg:text-left">About the position</h2>
                            <div class="mt-12">
                                <CommonRichText :blocks="positionData?.aboutThePosition" />
                            </div>
                            <div class="mt-12 flex justify-center lg:justify-start">
                                <a :href="positionData?.applyLink" target="_blank">
                                    <CommonButton>Apply</CommonButton>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-20 sm:mt-24 lg:mt-30">
                <CareersSection />
            </div>
        </div>
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getPositionBySlug } from '@/data/position'

const route = useRoute()
const positionData = await getPositionBySlug(route.params.id)

definePageMeta({
    scrollToTop: true,
})

useSeoObject(
    positionData?.value?.seo,
    positionData?.value?.title,
    positionData?.value?.image,
)
</script>