<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem]">
        <CommonPageHeader 
            :title="interiorsPageData?.title" 
            :description="interiorsPageData?.description" 
        />

        <div v-if="interiorsData && interiorsData.length > 0">
            <StudioGrid 
                :items="interiorsData" 
                :showFeatured="true"
                :isCollaboration="false" 
                :route="'/studio/interiors'"
            />
        </div>
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getInteriorsPage } from '@/data/interiorsPage'
import { getInteriors } from '@/data/interiors'

const interiorsPageData = await getInteriorsPage()
const interiorsData = await getInteriors()

useSeoObject(interiorsPageData?.seo, interiorsPageData?.title)
</script>
