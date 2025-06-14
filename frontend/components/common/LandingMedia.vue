<template>
    <div>
        <CommonMediaImage
            :image="image"
            width="1536"
            mobileWidth="768"
            class="absolute inset-0 w-full h-full object-cover"
        />
        <video
            v-if="videoUrl && image"
            ref="videoRef"
            muted
            loop
            autoplay
            playsinline
            :src="videoUrl"
            class="absolute inset-0 w-full h-full object-cover"
            :class="{ 'opacity-0': !canAutoplay }"
        />
    </div>
</template>

<script setup>
const props = defineProps({
    videoUrl: String,
    image: Object
})

const videoRef = ref(null)
const { canAutoplay } = useVideoAutoplay(videoRef)
</script>