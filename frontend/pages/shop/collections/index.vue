<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem] pb-20 sm:pb-24 lg:pb-30">
        <CommonPageHeader 
            :title="collectionsPageData?.title" 
            :description="collectionsPageData?.description" 
        />

        <div v-if="collectionsData && collectionsData.length > 0">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-2.5">
                <div v-for="collection in collectionsData" :key="collection._id">
                    <NuxtLink :to="`/shop/collections/${collection.slug.current}`" class="group">
                        <div class="relative overflow-hidden aspect-video group-hover:opacity-50 transition-opacity duration-300">
                            <CommonMediaImage
                                :image="collection.thumbnail || collection.cover"
                                :alt="collection.title"
                                width="1024"
                                mobileWidth="1024"
                                class="w-full h-full object-cover"
                            />
                        </div>

                        <CommonGridCaption>
                            <h2 class="text-h2 uppercase flex flex-col">{{ collection.title }}</h2>

                            <div v-if="collection.year" class="text-p2 opacity-30">
                                {{ collection.year }}
                            </div>
                        </CommonGridCaption>
                    </NuxtLink>
                </div>
            </div>
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
