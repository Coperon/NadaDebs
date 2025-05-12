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
            muted
            loop
            autoplay
            playsinline
            :src="videoUrl"
            class="absolute inset-0 w-full h-full object-cover"
        />
    </div>
</template>

<script setup>
const props = defineProps({
    videoUrl: String,
    image: Object
})
</script>