<template>
    <div
        ref="swiperContainer"
        class="swiper"
    >
        <div class="swiper-wrapper">
            <div 
                v-for="image in images"
                class="swiper-slide aspect-square sm:aspect-[4/3] md:aspect-[3/2] xl:aspect-[2/1] cursor-pointer"
            >
                <CommonMediaImage
                    class="w-full h-full object-cover"
                    :image="image"
                    width="1536"
                    mobileWidth="768"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import Swiper from 'swiper'
import 'swiper/css'

const swiperContainer = ref(null)

const props = defineProps({
    images: {
        type: Array,
        required: true,
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
        slidesPerView: 1.1,
        centeredSlides: false,
        spaceBetween: 16,
        loop: false,
        slideToClickedSlide: true,
        breakpoints: {
            640: {
                centeredSlides: true,
                slidesPerView: 1.2,
            },
            1280: {
                centeredSlides: true,
                slidesPerView: 1.3,
            }
        },
    })
}
</script>

<style scoped>
.swiper-slide-active {
    cursor: default;
}
</style>
