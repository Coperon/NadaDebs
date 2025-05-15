<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem]">
        <header class="py-20 sm:py-25 lg:py-30 px-4 flex flex-col items-center text-center gap-6">
            <h1 class="text-h1 uppercase">{{ collaborationsPageData?.title }}</h1>
            <div class="max-w-[62ch] mx-auto">
                {{ collaborationsPageData?.description }}
            </div>
        </header>

        <div v-if="collaborationsData && collaborationsData.length > 0" class="grid grid-cols-1 xl:grid-cols-3 gap-y-8 xl:gap-y-16 gap-x-2 pb-12">
            <div 
                v-for="collaboration in collaborationsData" 
                :key="collaboration._id"
                :class="collaboration.isFeatured ? 'xl:col-span-2 xl:row-span-2' : ''"
            >
                <NuxtLink 
                    :to="`/studio/collaborations/${collaboration.slug.current}`"
                    :class="collaboration.isFeatured ? 'xl:flex xl:flex-col xl:h-full' : ''"
                >
                    <div 
                        class="relative overflow-hidden"
                        :class="collaboration.isFeatured ? 'aspect-square xl:aspect-auto xl:flex-grow' : 'aspect-[3/2]'"
                    >
                        <CommonMediaImage
                            :image="collaboration.featuredImage"
                            :alt="collaboration.title"
                            :width="collaboration.isFeatured ? '1024' : '512'"
                            mobileWidth="384"
                            class="w-full h-full object-cover"
                        />
                    </div>

                    <div class="px-4 mt-2.5 xl:mt-5">
                        <h2 class="text-h2 uppercase flex flex-col gap-0.5">
                            <span class="font-light">Nada Debs x</span>
                            <span>{{ collaboration.title }}</span>
                        </h2>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getCollaborationsPage } from '@/data/collaborationsPage'
import { getCollaborations } from '@/data/collaborations'

const collaborationsPageData = await getCollaborationsPage()
const collaborationsData = await getCollaborations()

useSeoObject(collaborationsPageData?.seo, collaborationsPageData?.title)
</script>