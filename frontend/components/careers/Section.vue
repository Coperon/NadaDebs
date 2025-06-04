<template>
    <div class="lg:flex lg:gap-16 xl:gap-30">
        <div class="lg:w-2/5 xl:w-1/3">
            <div 
                class="px-4 sm:px-6 lg:px-8 xl:px-12"
                :class="{ 'text-center lg:mx-auto': positionsData?.length === 0 }"
            >
                <h2 class="text-h2 uppercase">Open positions</h2>
                <div 
                    class="mt-5 text-p2 whitespace-pre-line max-w-[48ch]"
                    :class="{ 'mx-auto': positionsData?.length === 0 }"
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
                    :class="positionsData?.length === 0 ? 'justify-center' : 'justify-start'"
                >
                    <a :href="workWithUsData?.openPositions?.applyLink" target="_blank">
                        <CommonButton isSecondary>Apply Spontaneously</CommonButton>
                    </a>
                </div>
            </div>
        </div>

        <div v-if="positionsData && positionsData.length > 0" class="mt-10 sm:mt-12 lg:mt-0 lg:w-3/5 xl:w-2/3">
            <CareersTable :positions="positionsData" />
        </div>
    </div>
</template>

<script setup>
import { getWorkWithUs } from '@/data/workWithUs'
import { getPositions } from '@/data/positions'

const workWithUsData = await getWorkWithUs()
const positionsData = await getPositions()
</script>