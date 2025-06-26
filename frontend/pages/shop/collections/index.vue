<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem] pb-20 sm:pb-24 lg:pb-30">
        <CommonPageHeader 
            :title="collectionsPageData?.title" 
            :description="collectionsPageData?.description" 
        />

        <div v-if="collectionsData && collectionsData.length > 0">
            <ShopCollectionsGrid :collections="collectionsData" />
        </div>
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getCollectionsPage } from '@/data/collectionsPage'
import { getCollections } from '@/data/collections'

const collectionsPageData = await getCollectionsPage()
const collectionsData = await getCollections()

useSeoObject(collectionsPageData?.seo, collectionsPageData?.title)
</script>
