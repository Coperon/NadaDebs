<template>
    <div :class="{ 'pt-[3.25rem] sm:pt-[4.25rem]': !postData?.cover }">
        <div v-if="postData?.cover" class="h-svh relative overflow-hidden">
            <CommonMediaImage
                :image="postData?.cover"
                :alt="postData?.cover?.alt"
                width="1536"
                mobileWidth="768"
                class="absolute inset-0 w-full h-full object-cover"
            />

            <div class="absolute inset-0 flex items-center justify-center text-center p-4 sm:p-6 lg:p-8 xl:p-12 bg-black/30 text-white">
                <div class="flex flex-col gap-3 sm:gap-4 lg:gap-6">
                    <div class="text-a2 uppercase">Latest News</div>
                    <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.05em] uppercase">{{ postData?.title }}</h1>
                </div>
            </div>
        </div>

        <CommonPageHeader :title="postData?.title" :description="postData?.text" />

        <div v-if="postData?.content && postData?.content?.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pb-20 sm:pb-24 lg:pb-30">
            <template v-for="item in postData?.content" :key="item._key">
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
import { getPostBySlug } from '@/data/post'

const route = useRoute()
const postData = await getPostBySlug(route.params.id)

definePageMeta({
    scrollToTop: true,
})

useSeoObject(
    postData?.value?.seo,
    postData?.value?.title,
    postData?.value?.cover || postData?.value?.thumbnail,
)
</script>