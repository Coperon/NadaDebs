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
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getWorkWithUs } from '@/data/workWithUs'
import { getPositions } from '@/data/positions'

const workWithUsData = await getWorkWithUs()
const positionsData = await getPositions()

const { formatDate } = useDateFormat()

useSeoObject(workWithUsData?.seo, workWithUsData?.title)
</script>