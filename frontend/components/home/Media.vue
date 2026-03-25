<template>
    <div class="absolute inset-0 transition-opacity duration-500">
        <CommonMediaImage
            :image="activeImage"
            width="1536"
            mobileWidth="768"
            class="absolute inset-0 w-full h-full object-cover lg:object-contain"
        />
        <video
            v-if="activeVideoUrl && activeImage"
            ref="videoRef"
            muted
            loop
            autoplay
            playsinline
            :src="activeVideoUrl"
            class="absolute inset-0 w-full h-full object-cover lg:object-contain"
            :class="{ 'opacity-0': !canAutoplay }"
        />
    </div>
</template>

<script setup>
const props = defineProps({
    videoUrl: String,
    image: Object,
    mobileImage: Object,
    mobileVideoUrl: String,
})

const isPortrait = ref(false)

onMounted(() => {
    if (!window?.matchMedia) return

    const mql = window.matchMedia('(orientation: portrait)')
    const update = () => {
        isPortrait.value = !!mql.matches
    }

    update()
    mql.addEventListener?.('change', update)

    onBeforeUnmount(() => {
        mql.removeEventListener?.('change', update)
    })
})

const activeImage = computed(() => (isPortrait.value && props.mobileImage ? props.mobileImage : props.image))
const activeVideoUrl = computed(() => (isPortrait.value && props.mobileVideoUrl ? props.mobileVideoUrl : props.videoUrl))

const videoRef = ref(null)
const { canAutoplay } = useVideoAutoplay(videoRef)
</script>