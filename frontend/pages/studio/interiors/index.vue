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
                :categories="categories"
            />
        </div>
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getInteriorsPage } from '@/data/interiorsPage'
import { getInteriors } from '@/data/interiors'
import { getInteriorCategories } from '@/data/interiorCategories'

const interiorsPageData = await getInteriorsPage()
const interiorsData = await getInteriors()
const categories = await getInteriorCategories()

useSeoObject(interiorsPageData?.seo, interiorsPageData?.title)
</script>
