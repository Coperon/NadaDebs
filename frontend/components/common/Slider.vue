<template>
    <div
        ref="swiperContainer"
        class="swiper flex flex-col flex-1 relative w-full h-full"
    >
        <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="image in images">
                <CommonMediaImage
                    class="w-full h-full block object-contain object-center"
                    :image="image"
                    width="1800"
                    mobileWidth="800"
                />
            </div>
        </div>
        <div class="swiper-pagination absolute bottom-0 right-0 p-2"></div>
        <div
            class="swiper-button-prev swiper-prev absolute top-0 left-0 w-1/2 h-full z-10"
        ></div>
        <div
            class="swiper-button-next swiper-next absolute top-0 right-0 w-1/2 h-full z-10"
        ></div>
    </div>
</template>

<script setup>
import Swiper from 'swiper'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'

const swiperContainer = ref(null)

const props = defineProps({
    images: {
        type: Array,
        required: true,
    },
    currentSlide: {
        type: Number,
    },
})
let swiper = null
const emit = defineEmits(['initialized'])

onMounted(() => {
    initSwiper()
})

onBeforeUnmount(() => {
    if (swiper) {
        swiper.destroy()
    }
})

const initSwiper = () => {
    swiper = new Swiper(swiperContainer.value, {
        modules: [Navigation, Pagination],
        slidesPerView: 1,
        spaceBetween: 30,
        loop: false,
        navigation: {
            nextEl: '.swiper-next',
            prevEl: '.swiper-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            type: 'fraction',
        },
    })
    changeSlide(props.currentSlide, 0)
}

const changeSlide = (index, duration=600) => {
    swiper.slideTo(index, duration)
}

// exposes methods to be used in parent component
defineExpose({
    changeSlide,
})
</script>

<style scoped>
.swiper-button {
    @apply mix-blend-difference;
}

.swiper-next:not(.swiper-button-disabled) {
    cursor: url('/icons/arrow-right.svg'), pointer;
}
.swiper-prev:not(.swiper-button-disabled) {
    cursor: url('/icons/arrow-left.svg'), pointer;
}
</style>
