<template>
    <ShopCategoryPage 
        :pageData="furniturePageData" 
        :categories="categories" 
        :allProducts="allProducts"
        categoryKey="furniture"
    />
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getFurniturePage } from '@/data/furniturePage'
import { getFurniture } from '@/data/furniture'
import { getFurnitureCategories } from '@/data/furnitureCategories'

const furniturePageData = await getFurniturePage()
const categories = await getFurnitureCategories()
const allProducts = await getFurniture()

useSeoObject(furniturePageData?.seo, furniturePageData?.title)
</script>
