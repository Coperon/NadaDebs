<template>
    <div class="fixed inset-0 transition-colors duration-500" :class="isBgWhite ? 'bg-white' : 'bg-beige'">
        <div class="fixed inset-0 lg:top-1/2 lg:-translate-y-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:w-[52vw] lg:h-[72vh]">
            <HomeMedia
                :image="homeData?.ourWorld?.image"
                :videoUrl="homeData?.ourWorld?.video"
                :class="{ 'opacity-100 z-20': activeImage === 'ourWorld', 'opacity-0 z-10': previousImage === 'ourWorld', 'opacity-0 z-0': activeImage !== 'ourWorld' && previousImage !== 'ourWorld' }"
            />
            <HomeMedia
                :image="homeData?.shop?.image"
                :videoUrl="homeData?.shop?.video"
                :class="{ 'opacity-100 z-20': activeImage === 'shop', 'opacity-0 z-10': previousImage === 'shop', 'opacity-0 z-0': activeImage !== 'shop' && previousImage !== 'shop' }"
            />
            <HomeMedia
                :image="homeData?.studio?.image"
                :videoUrl="homeData?.studio?.video"
                :class="{ 'opacity-100 z-20': activeImage === 'studio', 'opacity-0 z-10': previousImage === 'studio', 'opacity-0 z-0': activeImage !== 'studio' && previousImage !== 'studio' }"
            />
        </div>

        <!-- Mobile-->
        <nav id="mobile-menu" class="lg:hidden fixed inset-x-0 top-1/2 -translate-y-1/2">
            <ul class="flex flex-col items-center text-center gap-2.5">
                <li class="flex flex-col">
                    <button @click="toggleMenu('shop')" class="text-a1-bold uppercase">Shop</button>
                    <div class="overflow-hidden transition-all duration-300 ease-in-out" :style="{ maxHeight: activeMenu === 'shop' ? menuHeights.shop + 'px' : '0px' }">
                        <ul class="pt-2 flex flex-col items-center gap-2">
                            <li><NuxtLink to="" class="lowercase">Objects</NuxtLink></li>
                            <li><NuxtLink to="" class="lowercase">Furniture</NuxtLink></li>
                            <li><NuxtLink to="" class="lowercase">Collections</NuxtLink></li>
                        </ul>
                    </div>
                </li>
                <li class="flex flex-col">
                    <button @click="toggleMenu('ourWorld')" class="text-a1-bold uppercase">Our World</button>
                    <div class="overflow-hidden transition-all duration-300 ease-in-out" :style="{ maxHeight: activeMenu === 'ourWorld' ? menuHeights.ourWorld + 'px' : '0px' }">
                        <ul class="pt-2 flex flex-col items-center gap-2">
                            <li><NuxtLink to="" class="lowercase">About Nada Debs</NuxtLink></li>
                            <li><NuxtLink to="" class="lowercase">Contemporary Crafts</NuxtLink></li>
                        </ul>
                    </div>
                </li>
                <li class="flex flex-col">
                    <button @click="toggleMenu('studio')" class="text-a1-bold uppercase">Studio</button>
                    <div class="overflow-hidden transition-all duration-300 ease-in-out" :style="{ maxHeight: activeMenu === 'studio' ? menuHeights.studio + 'px' : '0px' }">
                        <ul class="pt-2 flex flex-col items-center gap-2">
                            <li><NuxtLink to="" class="lowercase">Collaborations</NuxtLink></li>
                            <li><NuxtLink to="" class="lowercase">Interiors</NuxtLink></li>
                            <li><NuxtLink to="" class="lowercase">Bespoke</NuxtLink></li>
                        </ul>
                    </div>
                </li>
            </ul>
        </nav>

        <!-- Desktop -->
        <nav id="desktop-menu" class="hidden lg:block fixed inset-x-20 xl:inset-x-32 top-1/2 -translate-y-1/2">
            <ul class="flex items-center">
                <li class="flex-1 flex justify-start">
                    <div @mouseenter="toggleMenu('shop'); isBgWhite = true; hoveredMenu = 'shop'" @mouseleave="toggleMenu('ourWorld'); isBgWhite = false; hoveredMenu = null" class="relative">
                        <NuxtLink to="" class="text-a1-bold uppercase transition-opacity duration-300" :class="{ 'opacity-30 text-a1-light': hoveredMenu && hoveredMenu !== 'shop' }">Shop</NuxtLink>
                        <Transition name="fade">
                            <ul v-if="activeMenu === 'shop'" class="absolute top-full left-0 pt-2 flex flex-col items-start text-a2">
                                <li><NuxtLink @mouseenter="hoveredSubmenu = 'objects'" @mouseleave="hoveredSubmenu = null" to="" class="lowercase whitespace-nowrap transition-opacity duration-300 py-0.5 flex" :class="{ 'opacity-30': hoveredSubmenu && hoveredSubmenu !== 'objects' }">Objects</NuxtLink></li>
                                <li><NuxtLink @mouseenter="hoveredSubmenu = 'furniture'" @mouseleave="hoveredSubmenu = null" to="" class="lowercase whitespace-nowrap transition-opacity duration-300 py-0.5 flex" :class="{ 'opacity-30': hoveredSubmenu && hoveredSubmenu !== 'furniture' }">Furniture</NuxtLink></li>
                                <li><NuxtLink @mouseenter="hoveredSubmenu = 'collections'" @mouseleave="hoveredSubmenu = null" to="" class="lowercase whitespace-nowrap transition-opacity duration-300 py-0.5 flex" :class="{ 'opacity-30': hoveredSubmenu && hoveredSubmenu !== 'collections' }">Collections</NuxtLink></li>
                            </ul>
                        </Transition>
                    </div>
                </li>
                <li class="flex-1 flex justify-center text-white">
                    <div @mouseenter="showOurWorldMenu = true; hoveredMenu = 'ourWorld'" @mouseleave="showOurWorldMenu = false; hoveredMenu = null" class="relative">
                        <NuxtLink to="" class="text-a1-bold uppercase transition-opacity duration-300" :class="{ 'opacity-30 text-a1-light': hoveredMenu && hoveredMenu !== 'ourWorld' }">Our World</NuxtLink>
                        <Transition name="fade">
                            <ul v-if="showOurWorldMenu" class="absolute top-full left-1/2 -translate-x-1/2 pt-2 flex flex-col items-center text-center text-a2">
                                <li><NuxtLink @mouseenter="hoveredSubmenu = 'about'" @mouseleave="hoveredSubmenu = null" to="" class="lowercase whitespace-nowrap transition-opacity duration-300 py-0.5 flex" :class="{ 'opacity-30': hoveredSubmenu && hoveredSubmenu !== 'about' }">About Nada Debs</NuxtLink></li>
                                <li><NuxtLink @mouseenter="hoveredSubmenu = 'crafts'" @mouseleave="hoveredSubmenu = null" to="" class="lowercase whitespace-nowrap transition-opacity duration-300 py-0.5 flex" :class="{ 'opacity-30': hoveredSubmenu && hoveredSubmenu !== 'crafts' }">Contemporary Crafts</NuxtLink></li>
                            </ul>
                        </Transition>
                    </div>
                </li>
                <li class="flex-1 flex justify-end">
                    <div @mouseenter="toggleMenu('studio'); isBgWhite = true; hoveredMenu = 'studio'" @mouseleave="toggleMenu('ourWorld'); isBgWhite = false; hoveredMenu = null" class="relative">
                        <NuxtLink to="/studio" class="text-a1-bold uppercase transition-opacity duration-300" :class="{ 'opacity-30 text-a1-light': hoveredMenu && hoveredMenu !== 'studio' }">Studio</NuxtLink>
                        <Transition name="fade">
                            <ul v-if="activeMenu === 'studio'" class="absolute top-full right-0 pt-2 flex flex-col items-end text-right text-a2">
                                <li><NuxtLink @mouseenter="hoveredSubmenu = 'collaborations'" @mouseleave="hoveredSubmenu = null" to="" class="lowercase whitespace-nowrap transition-opacity duration-300 py-0.5 flex" :class="{ 'opacity-30': hoveredSubmenu && hoveredSubmenu !== 'collaborations' }">Collaborations</NuxtLink></li>
                                <li><NuxtLink @mouseenter="hoveredSubmenu = 'interiors'" @mouseleave="hoveredSubmenu = null" to="" class="lowercase whitespace-nowrap transition-opacity duration-300 py-0.5 flex" :class="{ 'opacity-30': hoveredSubmenu && hoveredSubmenu !== 'interiors' }">Interiors</NuxtLink></li>
                                <li><NuxtLink @mouseenter="hoveredSubmenu = 'bespoke'" @mouseleave="hoveredSubmenu = null" to="" class="lowercase whitespace-nowrap transition-opacity duration-300 py-0.5 flex" :class="{ 'opacity-30': hoveredSubmenu && hoveredSubmenu !== 'bespoke' }">Bespoke</NuxtLink></li>
                            </ul>
                        </Transition>
                    </div>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getHomepageData } from '@/data/homepage'
import { ref, onMounted } from 'vue'

const homeData = await getHomepageData()
const activeMenu = ref(null)
const activeImage = ref('ourWorld')
const previousImage = ref('ourWorld')
const menuHeights = ref({
    shop: 0,
    ourWorld: 0,
    studio: 0
})
const showOurWorldMenu = ref(false)
const isBgWhite = ref(false)
const hoveredMenu = ref(null)
const hoveredSubmenu = ref(null)

const calculateMenuHeights = () => {
    const menus = document.querySelectorAll('#mobile-menu ul li div')
    menuHeights.value = {
        shop: menus[0].scrollHeight,
        ourWorld: menus[1].scrollHeight,
        studio: menus[2].scrollHeight
    }
}

const toggleMenu = (menu) => {
    if (activeMenu.value === menu) {
        activeMenu.value = null
        return
    }

    if (activeMenu.value) {
        activeMenu.value = null
        previousImage.value = activeImage.value
        activeMenu.value = menu
        activeImage.value = menu
        previousImage.value = null
    } else {
        previousImage.value = activeImage.value
        activeMenu.value = menu
        activeImage.value = menu
        previousImage.value = null
    }
}

onMounted(() => {
    calculateMenuHeights()
    window.addEventListener('resize', calculateMenuHeights)
})

definePageMeta({
    layout: 'home',
})

useSeoObject(homeData?.value?.seo, homeData?.value?.title)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
