<template>
    <div class="h-svh text-white">
        <div class="absolute inset-0">
            <CommonMediaImage
                :image="hero?.image"
                width="1536"
                mobileWidth="768"
                class="w-full h-full object-cover"
            />

            <video
                v-if="hero?.video && hero?.image"
                ref="video"
                muted
                loop
                autoplay
                playsinline
                :src="hero?.video"
                class="absolute inset-0 w-full h-full object-cover"
            />
        </div>

        <Transition name="fade">
            <div v-if="!playVideo" class="absolute inset-0 flex items-center bg-black/30">
                <div class="w-full">
                    <CommonPageHeader
                        :title="hero?.title"
                        :description="hero?.description"
                        class="relative"
                    />

                    <div v-if="hero?.video" class="-mt-12 sm:-mt-[4.25rem] lg:-mt-[5.5rem] relative flex justify-center">
                        <button 
                            @click="handlePlayVideo"
                            class="flex items-center gap-3 text-a2-bold uppercase" 
                            aria-label="Play video"
                        >
                            <IconsPlay class="w-6 h-6" />
                            <span>{{ hero?.playButtonText }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

        <Transition name="fade">
            <div v-if="playVideo" class="absolute bottom-6 sm:bottom-10 inset-x-0 flex justify-center">
                <button 
                    @click="playVideo = false" 
                    aria-label="Close video" 
                    class="flex items-center gap-1.5 text-a2 font-medium uppercase px-6 py-3 rounded-full text-black bg-white"
                >
                    <span>Close</span>
                    <svg class="h-2 w-auto" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.53591 8.03542L1.46484 0.964355" stroke="currentColor" stroke-width="0.666667" stroke-linecap="round"/>
                        <path d="M1.46409 8.03591L8.53516 0.964844" stroke="currentColor" stroke-width="0.666667" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>
        </Transition>
    </div>
</template>

<script setup>
const props = defineProps({
    hero: {
        type: Object,
        required: true
    }
})

const playVideo = ref(false)
const video = ref(null)

const handlePlayVideo = () => {
    playVideo.value = true
    // Restart and unmute video
    if (video.value) {
        video.value.currentTime = 0
        video.value.muted = false
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
    document.body.style.overflow = 'hidden'
}

watch(playVideo, (newValue) => {
    if (!newValue) {
        document.body.style.overflow = ''
        if (video.value) {
            video.value.muted = true
        }
    }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>