<template>
    <div
        ref="swiperContainer"
        class="swiper w-full h-full relative"
        id="product-gallery"
    >
        <div class="swiper-wrapper">
            <div v-if="featuredImage" class="swiper-slide bg-beige/30">
                <CommonMediaImage
                    :image="featuredImage"
                    width="768"
                    mobileWidth="768"
                    class="w-full h-full object-contain"
                />
            </div>

            <div v-if="secondaryImage" class="swiper-slide relative overflow-hidden">
                <CommonMediaImage
                    :image="secondaryImage"
                    width="768"
                    mobileWidth="768"
                    class="absolute inset-0 w-full h-full object-cover"
                />
            </div>
            
            <template v-if="moreImages && moreImages.length > 0">
                <div v-for="image in moreImages" class="swiper-slide relative overflow-hidden">
                    <CommonMediaImage
                        :image="image"
                        width="768"
                        mobileWidth="768"
                        class="absolute inset-0 w-full h-full object-cover"
                    />
                </div>
            </template>
        </div>

        <div class="swiper-pagination"></div>
    </div>
</template>

<script setup>
import Swiper from 'swiper'
import { Pagination, Mousewheel, FreeMode } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const swiperContainer = ref(null)

const props = defineProps({
    featuredImage: {
        type: Object,
        required: true,
    },
    secondaryImage: {
        type: Object,
        required: false,
    },
    moreImages: {
        type: Array,
        required: false,
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
        modules: [Pagination, Mousewheel, FreeMode],
        pagination: {
            el: '.swiper-pagination',
        },
        mousewheel: {
            enabled: true,
            forceToAxis: true,
            releaseOnEdges: true,
        },
        freeMode: true,
        breakpoints: {
            640: {
                direction: 'vertical',
            }
        }
    })
}
</script>

<style>
#product-gallery .swiper-pagination {
    @apply bottom-4 h-1 flex justify-center gap-2 sm:bottom-auto sm:h-full sm:w-1 sm:left-4 lg:left-6 xl:left-8 sm:flex-col;
}

#product-gallery .swiper-pagination-bullet {
    @apply w-1 h-1 m-0 rounded-full bg-black opacity-30;
}

#product-gallery .swiper-pagination-bullet-active {
    @apply opacity-100;
}
</style>
