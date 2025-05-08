<template>
   <CommonGallery :images="images" :caption="caption" :allowLightbox="allowLightbox" />
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
