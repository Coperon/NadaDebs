<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem] pb-20 sm:pb-24 lg:pb-30">
        <CommonPageHeader 
            :title="workWithUsData?.title" 
            :description="workWithUsData?.description" 
        />

        <CareersSection />

        <section>
            <CommonPageHeader
                title="About the Company"
                :description="workWithUsData?.aboutTheCompany?.description"
            />

            <div v-if="workWithUsData?.aboutTheCompany?.images && workWithUsData?.aboutTheCompany?.images.length > 0">
                <CommonSlider :images="workWithUsData?.aboutTheCompany?.images" />
            </div>

            <div v-if="workWithUsData?.team && workWithUsData?.team.length > 0" class="mt-20 sm:mt-24 lg:mt-30">
                <CommonAsideHeading title="Our Team" />

                <div class="mt-10 grid grid-cols-12 gap-x-2.5 gap-y-8 xl:gap-y-12">
                    <div 
                        v-for="(person, index) in workWithUsData?.team" 
                        :key="person._key" 
                        :class="getPersonClass(index)"
                    >
                        <div 
                            class="relative overflow-hidden" 
                            :class="getPersonImageClass(index)"
                        >
                            <CommonMediaImage
                                :image="person?.image"
                                :alt="person?.name"
                                :width="index < 2 ? '768' : '384'"
                                :mobileWidth="index === 0 ? '768' : '384'"
                                class="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>

                        <div class="px-4 mt-2.5 lg:mt-5">
                            <h3 class="text-h2 uppercase">{{ person?.name }}</h3>
                            <p class="text-p2">{{ person?.role }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getWorkWithUs } from '@/data/workWithUs'

const workWithUsData = await getWorkWithUs()

const getPersonClass = (index) => {
    if (index === 0) return 'col-span-12 sm:col-span-6'
    if (index === 1) return 'col-span-6'
    if (index > 1 && index < 6) return 'col-span-6 sm:col-span-4 lg:col-span-3'
    return 'col-span-6 sm:col-span-4 lg:col-span-3 xl:col-span-2'
}

const getPersonImageClass = (index) => {
    if (index === 0) return 'aspect-[3/2] xl:aspect-video'
    if (index === 1) return 'aspect-[3/4] sm:aspect-[3/2] xl:aspect-video'
    if (index > 1 && index < 6) return 'aspect-[3/4] sm:aspect-square'
    return 'aspect-[3/4] sm:aspect-square xl:aspect-[3/4]'
}

useSeoObject(workWithUsData?.seo, workWithUsData?.title)
</script>