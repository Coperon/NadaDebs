<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem]">
        <CommonPageHeader 
            :title="bespokeData?.title" 
            :description="bespokeData?.description" 
            :button="{
                text: 'Inquire',
                link: '/connect/contact-us',
            }"
        />

        <div v-if="bespokeData?.featuredImage" class="portrait:aspect-square landscape:aspect-auto landscape:h-screen relative overflow-hidden">
            <CommonMediaImage 
                :image="bespokeData?.featuredImage" 
                :alt="bespokeData?.featuredImage?.alt" 
                width="1536"
                mobileWidth="768"
                class="absolute inset-0 w-full h-full object-cover"
            />
        </div>

        <div v-if="bespokeData?.sections && bespokeData?.sections.length > 0" class="py-20 sm:py-24 lg:py-30 flex flex-col gap-16 sm:gap-21 xl:gap-30">
            <div v-for="section in bespokeData?.sections" :key="section._key">
                <div class="px-4 sm:px-6 lg:px-8 xl:px-12 text-center">
                    <h2 class="text-a1-bold uppercase">{{ section.title }}</h2>

                    <div v-if="section.highlightedText" class="mt-8">
                        <CommonQuote :text="section.highlightedText" />
                    </div>
                </div>

                <div v-if="section.images && section.images.length > 0" class="mt-12 xl:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    <div 
                        v-for="item in section.images" :key="item._key" 
                        class="h-[100vw] sm:h-[calc(50vw-0.3125rem)] lg:h-[calc(33.333333333333336vw-0.625rem)] relative overflow-hidden"
                        :class="item.image.asset.metadata.dimensions.aspectRatio > 1 ? 'sm:col-span-2' : 'aspect-square'"
                    >
                        <CommonMediaImage 
                            :image="item.image" 
                            :alt="item.image?.alt" 
                            :width="item.image.asset.metadata.dimensions.aspectRatio > 1 ? '1536' : '768'" 
                            mobileWidth="768" 
                            class="absolute inset-0 w-full h-full object-cover"
                        />
                        <video
                            v-if="item.video"
                            muted
                            loop
                            autoplay
                            playsinline
                            :src="item.video"
                            class="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- Related Products -->
        <div v-if="bespokeData?.relatedProducts && bespokeData?.relatedProducts?.length > 0" class="pb-20 sm:pb-24 lg:pb-30">
            <CommonAsideHeading title="Featured Furniture and Objects" />
            <ShopProductsGrid :products="bespokeData?.relatedProducts" />
        </div>
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getBespokePage } from '@/data/bespoke'

const bespokeData = await getBespokePage()

useSeoObject(bespokeData?.value?.seo, bespokeData?.value?.title)
</script>