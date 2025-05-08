<template>
    <div class="fixed inset-0 bg-sand">
        <div class="fixed inset-0">
            <Transition name="fade">
                <CommonMediaImage
                    v-if="!activeMenu || activeMenu === 'ourWorld'"
                    :image="homeData?.ourWorld?.image"
                    width="1536"
                    mobileWidth="768"
                    class="h-full w-full object-cover absolute inset-0"
                />
            </Transition>
            <Transition name="fade">
                <CommonMediaImage
                    v-if="activeMenu === 'shop'"
                    :image="homeData?.shop?.image"
                    width="1536"
                    mobileWidth="768"
                    class="h-full w-full object-cover absolute inset-0"
                />
            </Transition>
            <Transition name="fade">
                <CommonMediaImage
                    v-if="activeMenu === 'studio'"
                    :image="homeData?.studio?.image"
                    width="1536"
                    mobileWidth="768"
                    class="h-full w-full object-cover absolute inset-0"
                />
            </Transition>
        </div>

        <nav class="fixed inset-x-0 top-1/2 -translate-y-1/2">
            <ul class="flex flex-col items-center text-center gap-2.5">
                <li class="flex flex-col">
                    <button @click="toggleMenu('shop')" class="text-a1-bold uppercase">Shop</button>
                    <div class="menu-content" :class="{ 'is-open': activeMenu === 'shop' }">
                        <ul class="pt-2 flex flex-col items-center gap-2 overflow-hidden">
                            <li><NuxtLink to="" class="lowercase">Objects</NuxtLink></li>
                            <li><NuxtLink to="" class="lowercase">Furniture</NuxtLink></li>
                            <li><NuxtLink to="" class="lowercase">Collections</NuxtLink></li>
                        </ul>
                    </div>
                </li>
                <li class="flex flex-col">
                    <button @click="toggleMenu('ourWorld')" class="text-a1-bold uppercase">Our World</button>
                    <div class="menu-content" :class="{ 'is-open': activeMenu === 'ourWorld' }">
                        <ul class="pt-2 flex flex-col items-center gap-2 overflow-hidden">
                            <li><NuxtLink to="" class="lowercase">About Nada Debs</NuxtLink></li>
                            <li><NuxtLink to="" class="lowercase">Contemporary Crafts</NuxtLink></li>
                        </ul>
                    </div>
                </li>
                <li class="flex flex-col">
                    <button @click="toggleMenu('studio')" class="text-a1-bold uppercase">Studio</button>
                    <div class="menu-content" :class="{ 'is-open': activeMenu === 'studio' }">
                        <ul class="pt-2 flex flex-col items-center gap-2 overflow-hidden">
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

const homeData = await getHomepageData()
const activeMenu = ref(null)

const toggleMenu = (menu) => {
    activeMenu.value = activeMenu.value === menu ? null : menu
}

definePageMeta({
    layout: 'home',
})

useSeoObject(homeData?.value?.seo, homeData?.value?.title)
</script>

<style scoped>
.menu-content {
    max-height: 0;
    opacity: 0;
    transform: translateY(-10px);
    overflow: hidden;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform, opacity, max-height;
}

.menu-content.is-open {
    max-height: 200px;
    opacity: 1;
    transform: translateY(0);
}

/* Force hardware acceleration */
.menu-content * {
    transform: translateZ(0);
    backface-visibility: hidden;
}

/* Image transitions */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
    position: absolute;
    inset: 0;
}

.fade-enter-from {
    opacity: 0;
}

.fade-leave-to {
    opacity: 0;
}
</style>
