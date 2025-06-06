<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem] pb-20 sm:pb-24 lg:pb-30">
        <CommonPageHeader 
            :title="objectsPageData?.title" 
            :description="objectsPageData?.description" 
        />

        <div v-if="objectsData && objectsData.length > 0" class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-2.5 gap-y-8 md:gap-y-12 xl:gap-y-16">
            <div v-for="object in objectsData" :key="object._id">
                <NuxtLink :to="`/shop/${object.store.slug.current}`">
                    <div v-if="object?.featuredImage" class="aspect-[4/5] relative overflow-hidden bg-beige/30">
                        <CommonMediaImage
                            :image="object.featuredImage"
                            :alt="object.store.title"
                            width="384"
                            mobileWidth="384"
                            class="absolute inset-0 w-full h-full object-contain"
                        />
                    </div>

                    <div class="px-4 mt-2.5 lg:mt-5">
                        <h2 class="text-h2">{{ object.store.title }}</h2>
                        <div class="mt-1.5 opacity-50">
                            <ShopProductPrice :productGid="object?.store?.gid" :price="object?.store?.priceRange" />
                        </div>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getObjectsPage } from '@/data/objectsPage'
import { getObjects } from '@/data/objects'
import { getObjectsCategories } from '@/data/objectsCategories'

const objectsPageData = await getObjectsPage()
const objectsData = await getObjects()
const categories = await getObjectsCategories()

useSeoObject(objectsPageData?.seo, objectsPageData?.title)
</script>
