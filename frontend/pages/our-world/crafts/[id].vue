<template>
    <div>
        <div class="h-svh relative overflow-hidden">
            <CommonMediaImage
                :image="craftData?.cover"
                :alt="craftData?.cover?.alt"
                width="1536"
                mobileWidth="768"
                class="absolute inset-0 w-full h-full object-cover"
            />

            <div class="absolute top-30 left-0 px-[2.125rem] w-full max-w-md sm:left-12 sm:px-0 md:left-20 lg:left-30">
                <div class="flex gap-2">
                    <div v-if="craftData?.thumbnail?.image" class="w-2/5 xl:w-1/2 aspect-[23/29] shrink-0 relative">
                        <div class="relative overflow-hidden h-full">
                            <CommonMediaImage
                                :image="craftData?.thumbnail?.image"
                                :alt="craftData?.title"
                                width="384"
                                mobileWidth="384"
                                class="absolute inset-0 w-full h-full object-cover"
                            />
                            <video
                                v-if="craftData?.thumbnail?.video"
                                muted
                                loop
                                autoplay
                                playsinline
                                :src="craftData?.thumbnail?.video"
                                class="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>

                        <div class="absolute bottom-4 left-0 -translate-x-1/2 w-9 sm:w-12 xl:w-16 h-auto text-primary-button">
                            <IconsDots class="w-full h-auto" />
                        </div>
                    </div>

                    <div class="w-3/5 xl:w-1/2">
                        <h1 class="text-h2">{{ craftData?.title }}</h1>
                        <div v-if="craftData?.briefDescription" class="text-p2 mt-2 line-clamp-5">
                            {{ craftData?.briefDescription }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <CommonPageHeader :title="'About ' + craftData?.title" :description="craftData?.description" />

        <div v-if="craftData?.content && craftData?.content?.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pb-20 sm:pb-24 lg:pb-30">
            <template v-for="item in craftData?.content" :key="item._key">
                <div 
                    class="relative overflow-hidden"
                    :class="
                        item.size === '1x2' ? 'sm:row-span-2' 
                        : item.size === '2x1' ? 'sm:col-span-2' 
                        : ''
                    "
                >
                    <div v-if="item.size === '1x1'" class="pt-[100%]"></div>
                    <div v-if="item.size === '1x2'" class="pt-[200%]"></div>
                    <div v-if="item.size === '2x1'" class="pt-[100%] sm:pt-[50%]"></div>

                    <template v-if="item._type === 'contentMedia'">
                        <CommonMediaImage
                            :image="item.image"
                            :alt="item.image.alt"
                            :width="item.size === '2x1' ? '1024' : '512'"
                            mobileWidth="384"
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
                    </template>

                    <div v-if="item._type === 'contentText'" class="absolute inset-0 h-full flex items-center justify-center text-center p-4 sm:p-6 lg:p-8 xl:p-12">
                        <CommonQuote :text="item.text" :uppercase="false" />
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getCraftBySlug } from '@/data/craft'

const route = useRoute()
const craftData = await getCraftBySlug(route.params.id)

definePageMeta({
    scrollToTop: true,
})

useSeoObject(
    craftData?.value?.seo,
    craftData?.value?.title,
    craftData?.value?.cover,
)
</script>