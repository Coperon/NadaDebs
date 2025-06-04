<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem] pb-20 sm:pb-24 lg:pb-30">
        <CommonPageHeader 
            :title="workWithUsData?.title" 
            :description="workWithUsData?.description" 
        />

        <div class="lg:flex lg:gap-16 xl:gap-30">
            <div 
                class="px-4 sm:px-6 lg:px-8 xl:px-12"
                :class="{ 'text-center lg:mx-auto': positionsData.length === 0 }"
            >
                <h2 class="text-h2 uppercase">Open positions</h2>
                <div 
                    class="mt-5 text-p2 whitespace-pre-line max-w-[48ch]"
                    :class="{ 'mx-auto': positionsData.length === 0 }"
                >
                    <template v-if="positionsData && positionsData.length > 0">
                        {{ workWithUsData?.openPositions?.description }}
                    </template>
                    <template v-else>
                        {{ workWithUsData?.openPositions?.emptyDescription }}
                    </template>
                </div>

                <div 
                    v-if="workWithUsData?.openPositions?.applyLink" 
                    class="mt-6 flex"
                    :class="positionsData.length === 0 ? 'justify-center' : 'justify-start'"
                >
                    <a :href="workWithUsData?.openPositions?.applyLink" target="_blank">
                        <CommonButton isSecondary>Apply Spontaneously</CommonButton>
                    </a>
                </div>
            </div>

            <div v-if="positionsData && positionsData.length > 0" class="mt-10 sm:mt-12 lg:mt-0 lg:flex-grow">
                <div class="hidden sm:flex gap-4 text-a2 lowercase mb-4 px-4 sm:px-6 lg:px-8 xl:px-12">
                    <span class="w-1/6">City</span>
                    <span class="w-1/2">Position</span>
                    <span class="w-1/6">Open Until</span>
                    <span class="w-1/6"></span>
                </div>

                <div v-for="position in positionsData" :key="position._key" class="border-t border-black/50">
                    <NuxtLink :to="`/work-with-us/${position?.slug?.current}`" class="block px-4 sm:px-6 lg:px-8 xl:px-12 py-4 xl:py-5 hover:bg-primary-button transition-colors duration-300">
                        <dl class="flex flex-col gap-4 relative sm:flex-row sm:items-center">
                            <div class="sm:w-1/6">
                                <dt class="sm:hidden text-a2 lowercase mb-1">City</dt>
                                <dd class="text-a2-bold uppercase">{{ position?.location }}</dd>
                            </div>
                            <div class="sm:w-1/2">
                                <dt class="sm:hidden text-a2 lowercase mb-1">Position</dt>
                                <dd>
                                    {{ position?.position }}
                                    <template v-if="position?.experience">{{ ` | ${position?.experience}` }}</template>
                                    <template v-if="position?.type">{{ ` | ${position?.type}` }}</template>
                                </dd>
                            </div>
                            <div class="sm:w-1/6">
                                <dt class="sm:hidden text-a2 lowercase mb-1">Open Until</dt>
                                <dd>{{ formatDate(position?.openUntil) }}</dd>
                            </div>

                            <div class="absolute right-0 top-0 sm:static sm:w-1/6 sm:flex sm:justify-end">
                                <IconsArrow class="w-3 h-auto" />
                            </div>
                        </dl>
                    </NuxtLink>
                </div>
            </div>
        </div>

        <section>
            <CommonPageHeader
                title="About the Company"
                :description="workWithUsData?.aboutTheCompany?.description"
            />

            <div v-if="workWithUsData?.aboutTheCompany?.images && workWithUsData?.aboutTheCompany?.images.length > 0">
                <CommonSlider :images="workWithUsData?.aboutTheCompany?.images" />
            </div>

            <div v-if="workWithUsData?.team && workWithUsData?.team.length > 0" class="mt-20 sm:mt-24 lg:mt-30">
                <div class="px-4 sm:px-6 lg:px-8 xl:px-12">
                    <h2 class="text-h2 uppercase text-center">Our Team</h2>
                </div>

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
                            <p class="text-p2 mt-1.5">{{ person?.role }}</p>
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
import { getPositions } from '@/data/positions'

const workWithUsData = await getWorkWithUs()
const positionsData = await getPositions()

const { formatDate } = useDateFormat()

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