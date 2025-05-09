<template>
    <div>
        <CommonMediaImage
            :image="image"
            :width="width"
            :mobileWidth="mobileWidth"
            class="absolute inset-0 w-full h-full object-cover"
        />
        <video
            v-if="videoUrl && image"
            muted
            loop
            autoplay
            playsinline
            class="absolute inset-0 w-full h-full object-cover"
            :src="videoUrl"
        />
    </div>
</template>

<script setup>
const props = defineProps({
    videoUrl: String,
    image: Object,
    width: String,
    mobileWidth: String,
})
</script>