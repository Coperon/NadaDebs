<template>
    <div class="absolute inset-0 transition-opacity duration-500">
        <CommonMediaImage
            :image="image"
            width="1536"
            mobileWidth="768"
            class="absolute inset-0 w-full h-full object-cover lg:object-contain"
        />
        <video
            v-if="videoUrl && image"
            muted
            loop
            autoplay
            playsinline
            :src="videoUrl"
            class="absolute inset-0 w-full h-full object-cover lg:object-contain"
        />
    </div>
</template>

<script setup>
const props = defineProps({
    videoUrl: String,
    image: Object
})
</script>