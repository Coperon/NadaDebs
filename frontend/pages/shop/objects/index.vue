<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem] pb-20 sm:pb-24 lg:pb-30">
        <CommonPageHeader 
            :title="objectsPageData?.title" 
            :description="objectsPageData?.description" 
        />

        <div v-if="objectsData && objectsData.length > 0" class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-2.5 gap-y-8 md:gap-y-12 xl:gap-y-16">
            <div v-for="object in objectsData" :key="object._id" :class="object.isFeatured ? 'col-span-2' : ''">
                <NuxtLink :to="`/shop/${object.store.slug.current}`" class="group">
                    <div v-if="object?.featuredImage" class="relative overflow-hidden bg-beige/30" :class="object.isFeatured ? 'aspect-auto' : 'aspect-[4/5]'">
                        <CommonMediaImage
                            :image="object.featuredImage"
                            :alt="object.store.title"
                            :width="object.isFeatured ? '768' : '384'"
                            :mobileWidth="object.isFeatured ? '768' : '384'"
                            class="w-full h-full object-contain"
                            :class="object.isFeatured ? 'absolute inset-0' : ''"
                        />
                        <CommonMediaImage
                            v-if="object?.secondaryImage"
                            :image="object.secondaryImage"
                            :alt="object.store.title"
                            :width="object.isFeatured ? '768' : '384'"
                            :mobileWidth="object.isFeatured ? '768' : '384'"
                            class="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                        <div v-if="object.isFeatured" class="flex gap-x-2.5 w-full pointer-events-none">
                            <div class="aspect-[4/5] flex-1"></div>
                            <div class="aspect-[4/5] flex-1"></div>
                        </div>
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
