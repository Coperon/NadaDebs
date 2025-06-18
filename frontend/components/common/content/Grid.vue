<template>
    <div v-if="content && content?.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pb-20 sm:pb-24 lg:pb-30">
        <template v-for="item in content" :key="item._key">
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
</template>

<script setup>
const props = defineProps({
    content: {
        type: Array,
        required: true,
    },
})
</script>