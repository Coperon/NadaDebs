<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem] xl:pt-0">
        <article ref="scrollContainer" class="pb-12 xl:pb-0 xl:h-screen xl:pt-[4.25rem] xl:overflow-hidden xl:flex">
            <div class="px-4 sm:px-6 lg:px-8 xl:px-12 pt-16 xl:py-8 flex flex-col gap-6 xl:w-[40vw] xl:shrink-0 xl:sticky xl:left-0">
                <h1 class="text-h2 uppercase flex flex-col gap-1.5">
                    <span class="font-light">Nada Debs x</span>
                    <span>{{ collaborationData?.title }}</span>
                </h1>

                <div v-if="collaborationData?.description" class="max-w-[62ch] text-balance">
                    {{ collaborationData?.description }}
                </div>

                <div v-if="collaborationData?.year" class="text-a2-bold xl:text-h2 flex flex-col gap-1.5 xl:mt-auto">
                    <span class="uppercase">Year</span>
                    <span class="font-light">{{ collaborationData?.year }}</span>
                </div>
            </div>

            <div 
                ref="imagesContainer"
                v-if="collaborationData?.images && collaborationData?.images?.length > 0" 
                class="mt-12 xl:mt-0 flex flex-col xl:flex-row gap-2.5 xl:shrink-0 xl:relative xl:bg-sand"
            >
                <div v-for="image in collaborationData?.images" :key="image._key">
                    <CommonMediaImage
                        :image="image"
                        :alt="image.alt"
                        width="1536"
                        mobileWidth="768"
                        class="w-full h-auto xl:w-auto xl:h-full xl:shrink-0"
                    />
                </div>
            </div>
        </article>

        <aside v-if="collaborationData?.relatedCollaborations && collaborationData?.relatedCollaborations?.length > 0" class="pb-12">
            <div class="px-4 py-12 xl:pt-24">
                <h2 class="text-a2-bold uppercase text-center">Explore More</h2>
            </div>

            <div>
                <StudioGrid 
                    :items="collaborationData?.relatedCollaborations" 
                    :showFeatured="false" 
                    :isCollaboration="true" 
                    :route="'/studio/collaborations'"
                />
            </div>
        </aside>
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getCollaborationBySlug } from '@/data/collaboration'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const route = useRoute()
const collaborationData = await getCollaborationBySlug(route.params.id)
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

definePageMeta({
    scrollToTop: true,
})

useSeoObject(
    collaborationData?.value?.seo,
    collaborationData?.value?.title,
    collaborationData?.value?.featuredImage,
)
</script>