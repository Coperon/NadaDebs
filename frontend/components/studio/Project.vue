<template>
    <article class="pb-20 sm:pb-24 lg:pb-30">
        <div ref="scrollContainer" class="xl:h-screen xl:pt-[4.25rem] xl:overflow-hidden xl:flex xl:relative">
            <div class="px-4 sm:px-6 lg:px-8 xl:px-12 pt-16 xl:py-8 flex flex-col gap-6 xl:w-[40vw] xl:shrink-0 xl:sticky xl:left-0">
                <h1 class="text-h2 uppercase flex flex-col">
                    <span v-if="isCollaboration" class="font-light">Nada Debs x</span>
                    <span>{{ title }}</span>
                </h1>

                <div v-if="description" class="max-w-[62ch] text-balance whitespace-pre-line">
                    {{ description }}
                </div>

                <div v-if="year" class="flex items-start gap-12 text-a2-bold xl:text-h2 xl:mt-auto max-w-[62ch] xl:max-w-none">
                    <div v-if="location" class="w-1/2 flex flex-col gap-1.5">
                        <span class="uppercase">Location</span>
                        <span class="font-light">{{ location }}</span>
                    </div>

                    <div class="w-1/2 flex flex-col gap-1.5">
                        <span class="uppercase">Year</span>
                        <span class="font-light">{{ year }}</span>
                    </div>
                </div>
            </div>

            <div 
                ref="imagesContainer"
                v-if="images && images?.length > 0" 
                class="mt-12 xl:mt-0 flex flex-col xl:flex-row gap-2.5 xl:shrink-0 xl:relative xl:bg-beige"
            >
                <div v-for="image in images" :key="image._key">
                    <CommonMediaImage
                        :image="image"
                        :alt="image.alt"
                        width="1536"
                        mobileWidth="768"
                        class="w-full h-auto xl:w-auto xl:h-full xl:shrink-0"
                    />
                </div>

                <div class="hidden xl:block absolute -left-10 bottom-10 text-black">
                    <IconsDots class="w-20 h-auto" />
                </div>
            </div>

            <div class="hidden xl:block absolute right-12 bottom-8">
                <NuxtLink to="/connect/contact-us">
                    <CommonButton>Inquire</CommonButton>
                </NuxtLink>
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
                end: () => `+=${imagesContainer.value.scrollWidth - window.innerWidth * 0.6}`,
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            }
        })

        tl.to(imagesContainer.value, {
            x: () => -(imagesContainer.value.scrollWidth - window.innerWidth * 0.6),
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