<template>
    <div v-if="images && images.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        <div 
            v-for="image in images" 
            :key="image._key" 
            class="relative overflow-hidden"
            :class="image.asset.metadata.dimensions.aspectRatio < 1 ? 'aspect-[3/4] sm:aspect-auto sm:row-span-2' : 'aspect-square sm:aspect-[3/2]'"
        >
            <CommonMediaImage
                :image="image"
                :alt="image.alt"
                width="1024"
                mobileWidth="768"
                class="absolute inset-0 w-full h-full object-cover"
            />

            <div v-if="image.asset.metadata.dimensions.aspectRatio < 1" class="hidden sm:flex flex-col gap-2.5">
                <div class="aspect-[3/2]"></div>
                <div class="aspect-[3/2]"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    images: {
        type: Array,
        required: true,
    },
})
</script>