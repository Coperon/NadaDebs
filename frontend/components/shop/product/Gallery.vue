<template>
    <!-- Mobile carousel -->
    <div
        ref="swiperContainer"
        class="swiper w-full h-full relative sm:!hidden"
        :style="productImageBackgroundStyle"
        id="product-gallery"
    >
        <div class="swiper-wrapper">
            <div
                v-for="item in items"
                :key="item.key"
                class="swiper-slide relative overflow-hidden"
            >
                <img
                    v-if="item.type === 'preview'"
                    :src="item.src"
                    :srcset="`${item.src}?width=1024 1024w, ${item.src}?width=1920 1920w`"
                    sizes="1024px"
                    :alt="title"
                    class="absolute inset-0 w-full h-full object-cover"
                />
                <template v-else>
                    <CommonMediaImage
                        :image="item.image"
                        width="1920"
                        mobileWidth="1024"
                        class="absolute inset-0 w-full h-full"
                        :class="item.objectContain ? 'object-contain' : 'object-cover'"
                    />
                    <video
                        v-if="item.video"
                        muted
                        loop
                        autoplay
                        playsinline
                        :src="item.video"
                        class="absolute inset-0 w-full h-full object-cover"
                    />
                </template>
            </div>
        </div>

        <div class="swiper-pagination"></div>
    </div>

    <!-- Desktop: stacked, scroll inside viewport container -->
    <div class="hidden sm:block relative w-full h-full" :style="productImageBackgroundStyle">
        <div
            ref="stackRef"
            class="gallery-stack w-full h-full overflow-y-auto"
            @scroll="onStackScroll"
        >
            <div
                v-for="item in items"
                :key="item.key"
                data-gallery-item
            >
                <img
                    v-if="item.type === 'preview'"
                    :src="item.src"
                    :srcset="`${item.src}?width=1024 1024w, ${item.src}?width=1920 1920w`"
                    sizes="1920px"
                    :alt="title"
                    class="w-full h-auto"
                />
                <video
                    v-else-if="item.video"
                    muted
                    loop
                    autoplay
                    playsinline
                    :src="item.video"
                    class="w-full h-auto"
                />
                <CommonMediaImage
                    v-else
                    :image="item.image"
                    width="1920"
                    mobileWidth="1024"
                    class="w-full h-auto"
                />
            </div>
        </div>

        <div
            v-if="items.length > 1"
            class="pointer-events-none absolute left-4 top-0 h-full w-1 flex flex-col justify-center gap-2 lg:left-6 xl:left-8"
        >
            <button
                v-for="(item, index) in items"
                :key="`bullet-${item.key}`"
                type="button"
                class="pointer-events-auto w-1 h-1 m-0 rounded-full bg-black transition-opacity"
                :class="activeIndex === index ? 'opacity-100' : 'opacity-30'"
                :aria-label="`Go to image ${index + 1}`"
                @click="scrollToIndex(index)"
            />
        </div>
    </div>
</template>

<script setup>
import Swiper from 'swiper'
import { Pagination, Mousewheel } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { getShopPageData } from '@/data/shopPage'

const swiperContainer = ref(null)
const shopData = await getShopPageData()

const productImageBackgroundStyle = computed(() => ({
    backgroundColor: shopData.value?.productImageBackgroundColor || 'rgba(241, 234, 228, 0.3)',
}))

const props = defineProps({
    previewImage: {
        type: String,
        default: '',
    },
    featuredImage: {
        type: Object,
        required: false,
    },
    secondaryImage: {
        type: Object,
        required: false,
    },
    moreImages: {
        type: Array,
        required: false,
    },
    modelImages: {
        type: Array,
        required: false,
    },
    title: {
        type: String,
        required: true,
    },
})

const items = computed(() => {
    const result = []

    if (props.featuredImage) {
        result.push({
            key: 'featured',
            type: 'image',
            image: props.featuredImage,
            objectContain: true,
        })
    } else if (props.previewImage?.trim()) {
        result.push({
            key: 'preview',
            type: 'preview',
            src: props.previewImage,
        })
    }

    props.moreImages?.forEach((item, index) => {
        result.push({
            key: `more-${index}`,
            type: 'image',
            image: item.image || item,
            video: item.video,
        })
    })

    props.modelImages?.forEach((item, index) => {
        result.push({
            key: `model-${index}`,
            type: 'image',
            image: item.image || item,
            video: item.video,
        })
    })

    if (props.secondaryImage) {
        result.push({
            key: 'secondary',
            type: 'image',
            image: props.secondaryImage,
        })
    }

    return result
})

const stackRef = ref(null)
const activeIndex = ref(0)
let swiper = null

const onStackScroll = () => {
    const el = stackRef.value
    if (!el) return

    const slides = el.querySelectorAll('[data-gallery-item]')
    if (!slides.length) return

    const midpoint = el.scrollTop + el.clientHeight / 2
    let closest = 0
    let closestDist = Infinity

    slides.forEach((slide, index) => {
        const center = slide.offsetTop + slide.offsetHeight / 2
        const dist = Math.abs(center - midpoint)
        if (dist < closestDist) {
            closestDist = dist
            closest = index
        }
    })

    activeIndex.value = closest
}

const scrollToIndex = (index) => {
    const el = stackRef.value
    const slide = el?.querySelectorAll('[data-gallery-item]')[index]
    if (!slide) return

    el.scrollTo({ top: slide.offsetTop, behavior: 'smooth' })
}

onMounted(() => {
    if (!swiperContainer.value) return

    swiper = new Swiper(swiperContainer.value, {
        modules: [Pagination, Mousewheel],
        pagination: {
            el: '.swiper-pagination',
        },
        mousewheel: {
            enabled: true,
            forceToAxis: true,
            releaseOnEdges: false,
        },
    })
})

onBeforeUnmount(() => {
    swiper?.destroy()
})
</script>

<style>
#product-gallery .swiper-pagination {
    @apply bottom-4 h-1 flex justify-center gap-2;
}

#product-gallery .swiper-pagination-bullet {
    @apply w-1 h-1 m-0 rounded-full bg-black opacity-30;
}

#product-gallery .swiper-pagination-bullet-active {
    @apply opacity-100;
}

.gallery-stack {
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.gallery-stack::-webkit-scrollbar {
    display: none;
}
</style>
