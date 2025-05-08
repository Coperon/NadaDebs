<template>
    <figure>
        <div class="gallery grid grid-cols-12 gap-2 relative">
            <div
                class="col-span-6 aspect-[4/3]"
                v-for="(image, index) in images"
            >
                <CommonMediaImage
                    class="w-full h-full object-cover block"
                    :image="image"
                    width="350"
                    mobileWidth="250"
                    :class="{ 'cursor-zoom-in': allowLightbox }"
                    @click="goToFullScreen"
                    :data-index="index"
                />
            </div>
        </div>
        <CommonMediaCaption v-if="caption" :caption="caption" />
        <template v-if="allowLightbox">
            <!-- Move the lightbox modal slider to <body> -->
            <Teleport to="body">
                <div
                    class="overlayed fixed top-0 left-0 w-full h-full z-50 flex flex-col items-center justify-center"
                    :class="{
                        'opacity-0': !showModal,
                        'pointer-events-none': !showModal,
                    }"
                >
                    <CommonSlider
                        v-if="initialized"
                        ref="slider"
                        :images="images"
                        :currentSlide="currentSlide"
                    />
                    <button
                        class="absolute top-0 right-0 p-2 z-50"
                        @click="exitFullscreen"
                        aria-label="Close"
                    >
                        <svg
                            class="w-[30px] h-auto"
                            stroke="currentColor"
                            fill="currentColor"
                            stroke-width="0"
                            viewBox="0 0 512 512"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill="none"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="32"
                                d="M368 368 144 144m224 0L144 368"
                            ></path>
                        </svg>
                    </button>
                </div>
            </Teleport>
        </template>
    </figure>
</template>

<script setup>
const initialized = ref(false)
const showModal = ref(false)
const currentSlide = ref(0)
const slider = ref()

const props = defineProps({
    images: {
        type: Array,
        required: true,
    },
    caption: {
        type: Array,
    },
    allowLightbox: {
        type: Boolean,
        default: true,
    },
})

const goToFullScreen = async e => {
    showModal.value = true
    currentSlide.value = parseInt(e.target.closest('picture').dataset.index)
    if (initialized.value) {
        slider.value.changeSlide(currentSlide.value, 0)
    }
    initialized.value = true
}

const exitFullscreen = () => {
    showModal.value = false
}
</script>

<style scoped>
.overlayed::before {
    @apply absolute inset-0 bg-white bg-opacity-90 w-full h-full content-[''];
}
</style>
