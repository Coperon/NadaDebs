<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem] pb-20 sm:pb-24 lg:pb-30">
        <CommonPageHeader 
            :title="collectionsPageData?.title" 
            :description="collectionsPageData?.description" 
        />

        <div v-if="collectionsPageData?.collectionOrder && collectionsPageData.collectionOrder.length > 0">
            <ShopCollectionsGrid :collections="collectionsPageData?.collectionOrder" />
        </div>
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getCollectionsPage } from '@/data/collectionsPage'

const collectionsPageData = await getCollectionsPage()

useSeoObject(collectionsPageData?.value?.seo, collectionsPageData?.value?.title)
</script>
