<template>
    <ShopCategoryPage 
        :pageData="objectsPageData" 
        :categories="categories" 
        :allProducts="allProducts"
        categoryKey="objects"
    />
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getObjectsPage } from '@/data/objectsPage'
import { getObjects } from '@/data/objects'
import { getObjectsCategories } from '@/data/objectsCategories'

const objectsPageData = await getObjectsPage()
const categories = await getObjectsCategories()
const allProducts = await getObjects()

useSeoObject(objectsPageData?.value?.seo, objectsPageData?.value?.title)
</script>
