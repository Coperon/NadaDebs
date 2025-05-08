<template>
    <figure>
        <div ref="mediaWrapper" class="relative">
            <CommonMediaImage
                class="w-full h-full block object-contain object-center"
                :image="media"
                :width="width"
                :mobileWidth="mobileWidth"
                :loading="useLazy ? 'lazy' : 'eager'" 
            />
            <video
                ref="video"
                v-if="media?.videoUrl"
                preload="none"
                muted
                playsinline
                class="absolute w-full h-full object-cover top-0 left-0"
                :src="media?.videoUrl"
            />
            <button
                v-if="media?.videoUrl && !hasAutoplay && !isPlaying"
                @click="togglePlay"
                aria-label="Play video"
                class="absolute top-0 lef-0 bg-black bg-opacity-30 w-full h-full text-white flex justify-center items-center"
            >
                <svg
                    class="w-16 h-auto pointer-events-none"
                    stroke="currentColor"
                    fill="currentColor"
                    stroke-width="0"
                    viewBox="0 0 512 512"
                    height="200px"
                    width="200px"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M128 104.3v303.4c0 6.4 6.5 10.4 11.7 7.2l240.5-151.7c5.1-3.2 5.1-11.1 0-14.3L139.7 97.2c-5.2-3.3-11.7.7-11.7 7.1z"
                    ></path>
                </svg>
            </button>
        </div>
        <CommonMediaCaption v-if="media?.caption" :caption="media?.caption" />
    </figure>
</template>

<script setup>
import { playVideo, pauseVideo } from '@/composables/videoPlayer'

const props = defineProps({
    media: {
        type: Object,
        required: true,
    },
    width: {
        type: String,
        required: true,
    },
    mobileWidth: {
        type: String,
        required: true,
    },
    useLazy: {
        type: Boolean,
        default: true,
    },
})

const hasAutoplay = props.media?.videoUrl && props.media?.autoplay

const isPlaying = ref(hasAutoplay)
const video = ref(null)
const mediaWrapper = ref(null)

const togglePlay = () => {
    if (!hasAutoplay && video?.value) {
        if (video?.value?.paused) {
            playVideo(video?.value)
            isPlaying.value = true
            video?.value.setAttribute('controls', true)
        }
    }
}
let observer = null
onMounted(() => {
    if (video && video?.value) {
        if (!hasAutoplay) {
            unmuteVideo()
        } else {
            muteVideo()
            video.value.loop = true
        }
        observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (hasAutoplay) {
                            playVideo(video?.value)
                        }
                    } else {
                        pauseVideo(video?.value)
                    }
                })
            },
            { threshold: 0.1 },
        )
        observer.observe(video?.value)
    }
})

const muteVideo = () => {
    if (video && video?.value) {
        video.value.muted = true
        video.value.setAttribute('muted', true)
    }
}

const unmuteVideo = () => {
    if (video && video?.value) {
        video.value.muted = false
        video.value.removeAttribute('muted')
    }
}

onBeforeUnmount(() => {
    if (observer) {
      observer.disconnect();
    }
})

provide('mediaWrapper', mediaWrapper)
</script>
