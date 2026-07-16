<template>
    <article class="pb-20 sm:pb-24 lg:pb-30">
        <div ref="scrollContainer" class="xl:h-screen xl:pt-[4.25rem] xl:overflow-hidden xl:flex xl:flex-col xl:relative">
            <div class="px-4 sm:px-6 lg:px-8 xl:px-12 pt-16 xl:py-8 flex flex-col gap-6 lg:w-[60vw] xl:w-[40vw] xl:shrink-0 xl:sticky xl:left-0">
                <div class="flex items-end justify-between">
                    <h1 class="flex flex-col">
                        <span v-if="isCollaboration" class="text-h2 uppercase font-light">Nada Debs x</span>
                        <span class="text-a1-bold uppercase">{{ title }}</span>
                    </h1>
                    <div v-if="year" class="text-h2 flex flex-col items-end">
                        <div v-if="location" class="font-light">{{ location }}</div>
                        <div>{{ year }}</div>
                    </div>
                </div>

                <div v-if="description" class="text-pretty xl:line-clamp-6">
                    {{ description }}
                </div>

                <div class="flex justify-center">
                    <NuxtLink to="/connect/contact-us">
                        <CommonButton>Inquire</CommonButton>
                    </NuxtLink>
                </div>
            </div>

            <div 
                ref="imagesContainer"
                v-if="images && images?.length > 0" 
                class="mt-12 xl:mt-0 flex flex-col xl:flex-row gap-3.5 xl:flex-1 xl:min-h-0 xl:pl-[50vw] xl:relative xl:bg-beige"
            >
                <div v-for="image in images" :key="image._key" class="relative xl:shrink-0 xl:h-full">
                    <CommonMediaImage
                        :image="image.image"
                        :alt="image.image.alt"
                        width="1536"
                        mobileWidth="768"
                        class="w-full h-auto xl:w-auto xl:h-full xl:shrink-0"
                    />
                    <video
                        v-if="image.video"
                        muted
                        loop
                        autoplay
                        playsinline
                        :src="image.video"
                        class="absolute inset-0 w-full h-full object-cover"
                    />
                </div>

                <div class="hidden xl:block absolute left-1/2 -translate-x-1/2 bottom-7 2xl:bottom-9 text-black">
                    <IconsDots class="w-14 2xl:w-[4.5rem] h-auto" />
                </div>
            </div>
        </div>
    </article>
</template>

<script setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

defineProps({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    location: {
        type: String,
        required: false,
    },
    year: {
        type: Number,
        required: true,
    },
    images: {
        type: Array,
        required: true,
    },
    isCollaboration: {
        type: Boolean,
        required: false,
        default: false,
    },
})

const scrollContainer = ref(null)
const imagesContainer = ref(null)
let tl = null
let mm = null

const initGSAP = () => {
    if (scrollContainer.value && imagesContainer.value) {
        tl = gsap.timeline({
            scrollTrigger: {
                trigger: scrollContainer.value,
                start: 'top top',
                end: () => `+=${imagesContainer.value.scrollWidth - window.innerWidth}`,
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            }
        })

        tl.to(imagesContainer.value, {
            x: () => -(imagesContainer.value.scrollWidth - window.innerWidth),
            ease: 'none'
        })
    }
}

const cleanupGSAP = () => {
    if (tl?.scrollTrigger) {
        tl.scrollTrigger.kill()
    }
    tl = null
    if (mm) {
        mm.kill()
    }
    mm = null
}

const handleResize = () => {
    if (window.innerWidth >= 1280) {
        if (!tl) {
            initGSAP()
        } else if (tl?.scrollTrigger) {
            tl.scrollTrigger.refresh()
        }
    } else {
        cleanupGSAP()
    }
}

onMounted(() => {
    mm = gsap.matchMedia()

    mm.add("(min-width: 1280px)", () => {
        initGSAP()
        return () => {
            cleanupGSAP()
        }
    })

    window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
    cleanupGSAP()
    window.removeEventListener('resize', handleResize)
})
</script>