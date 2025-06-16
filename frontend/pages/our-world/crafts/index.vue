<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem] pb-20 sm:pb-24 lg:pb-30">
        <CommonPageHeader 
            :title="craftsPageData?.title" 
            :description="craftsPageData?.description" 
        />

        <CraftsGrid :crafts="craftsData" />
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getCraftsPage } from '@/data/craftsPage'
import { getCrafts } from '@/data/crafts'

const craftsPageData = await getCraftsPage()
const craftsData = await getCrafts()

useSeoObject(craftsPageData?.seo, craftsPageData?.title)
</script>