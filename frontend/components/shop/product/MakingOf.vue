<template>
    <div v-if="mediaItems && mediaItems.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        <div 
            v-for="mediaItem in mediaItems" 
            :key="mediaItem._key" 
            class="relative overflow-hidden"
            :class="mediaItem.image.asset.metadata.dimensions.aspectRatio < 1 ? 'aspect-[3/4] sm:aspect-auto sm:row-span-2' : 'aspect-square sm:aspect-[3/2]'"
        >
            <CommonMediaImage
                :image="mediaItem.image"
                :alt="mediaItem.image.alt"
                width="1024"
                mobileWidth="768"
                class="absolute inset-0 w-full h-full object-cover"
            />
            <video
                v-if="mediaItem.video"
                muted
                loop
                autoplay
                playsinline
                :src="mediaItem.video"
                class="absolute inset-0 w-full h-full object-cover"
            />

            <div v-if="mediaItem.image.asset.metadata.dimensions.aspectRatio < 1" class="hidden sm:flex flex-col gap-3.5">
                <div class="aspect-[3/2]"></div>
                <div class="aspect-[3/2]"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    mediaItems: {
        type: Array,
        required: true,
    },
})
</script>