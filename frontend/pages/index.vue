<template>
    <div class="fixed inset-0 bg-sand">
        <div class="fixed inset-0">
            <CommonImageOrVideo
                :image="homeData?.ourWorld?.image"
                :videoUrl="homeData?.ourWorld?.video"
                width="1536"
                mobileWidth="768"
                class="h-full w-full object-cover absolute inset-0 transition-opacity duration-1000"
                :class="{ 'opacity-100 z-20': activeImage === 'ourWorld', 'opacity-0 z-10': previousImage === 'ourWorld', 'opacity-0 z-0': activeImage !== 'ourWorld' && previousImage !== 'ourWorld' }"
            />
            <CommonImageOrVideo
                :image="homeData?.shop?.image"
                :videoUrl="homeData?.shop?.video"
                width="1536"
                mobileWidth="768"
                class="h-full w-full object-cover absolute inset-0 transition-opacity duration-1000"
                :class="{ 'opacity-100 z-20': activeImage === 'shop', 'opacity-0 z-10': previousImage === 'shop', 'opacity-0 z-0': activeImage !== 'shop' && previousImage !== 'shop' }"
            />
            <CommonImageOrVideo
                :image="homeData?.studio?.image"
                :videoUrl="homeData?.studio?.video"
                width="1536"
                mobileWidth="768"
                class="h-full w-full object-cover absolute inset-0 transition-opacity duration-1000"
                :class="{ 'opacity-100 z-20': activeImage === 'studio', 'opacity-0 z-10': previousImage === 'studio', 'opacity-0 z-0': activeImage !== 'studio' && previousImage !== 'studio' }"
            />
        </div>

        <!-- Mobile-->
        <nav id="mobile-menu" class="fixed inset-x-0 top-1/2 -translate-y-1/2">
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
        setTimeout(() => {
            previousImage.value = activeImage.value
            activeMenu.value = menu
            activeImage.value = menu
            setTimeout(() => {
                previousImage.value = null
            }, 500)
        }, 300)
    } else {
        previousImage.value = activeImage.value
        activeMenu.value = menu
        activeImage.value = menu
        setTimeout(() => {
            previousImage.value = null
        }, 500)
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