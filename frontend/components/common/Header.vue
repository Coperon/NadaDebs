<template>
    <header
        class="fixed inset-0 h-screen z-10"
        :class="menuState.isOpened ? 'pointer-events-auto' : 'pointer-events-none'"
    >
        <div 
            class="absolute inset-x-0 h-[3.25rem] sm:h-[4.25rem] transition-colors duration-300"
            :class="headerBgClass"
        ></div>

        <div class="absolute inset-0 text-black transition-opacity duration-300" :class="{ 'opacity-0 pointer-events-none': !menuState.isOpened }">
            <div 
                class="absolute inset-0" 
                :class="route.path.startsWith('/shop/') ? 'bg-beige/20' : 'bg-transparent'"
                @click="toggleMenuState"
            ></div>
            <div class="bg-white absolute h-svh left-0 w-full sm:max-w-[24rem] pt-[3.25rem] sm:pt-[4.25rem] flex flex-col">
                <div class="px-4 sm:px-6 lg:hidden">
                    <div class="shrink-0 border-t border-b border-current py-1.5 flex items-center text-a2 font-medium lowercase">
                        <button @click="openSearch" class="pr-2.5 py-1 shrink-0 flex-1 text-left lowercase">Search</button>
                        <div class="pl-2.5 py-1 border-l border-current flex-1 flex justify-end">
                            <ClientOnly><ShopCountrySelector /></ClientOnly>
                        </div>
                    </div>
                </div>

                <nav class="flex-grow flex flex-col justify-between gap-12 px-4 py-8 sm:px-6 lg:px-8 lg:py-12 xl:px-12 xl:py-16 overflow-y-auto">
                    <ul class="flex flex-col gap-2">
                        <li>
                            <button @click="isShopMenuOpen = !isShopMenuOpen" class="text-a1-bold uppercase text-left flex items-center gap-0.5">
                                <span>Shop</span>
                                <div class="transition-transform object-center duration-300" :class="isShopMenuOpen ? 'rotate-45' : 'rotate-0'">
                                    <svg class="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                                    </svg>
                                </div>
                            </button>
                            <Transition name="fade">
                                <div v-if="isShopMenuOpen" class="overflow-hidden max-h-48">
                                    <ul class="pt-2.5 pb-4 flex flex-col gap-2.5">
                                        <li><NuxtLink @click="toggleMenuState" to="/shop/objects" class="lowercase">Objects</NuxtLink></li>
                                        <li><NuxtLink @click="toggleMenuState" to="/shop/furniture" class="lowercase">Furniture</NuxtLink></li>
                                        <li><NuxtLink @click="toggleMenuState" to="/shop/collections" class="lowercase">Collections</NuxtLink></li>
                                    </ul>
                                </div>
                            </Transition>
                        </li>
                        <li>
                            <button @click="isStudioMenuOpen = !isStudioMenuOpen" class="text-a1-bold uppercase text-left flex items-center gap-0.5">
                                <span>Studio</span>
                                <div class="transition-transform object-center duration-300" :class="isStudioMenuOpen ? 'rotate-45' : 'rotate-0'">
                                    <svg class="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                                    </svg>
                                </div>
                            </button>
                            <Transition name="fade">
                                <div v-if="isStudioMenuOpen" class="overflow-hidden max-h-48">
                                    <ul class="pt-2.5 pb-4 flex flex-col gap-2.5">
                                        <li><NuxtLink @click="toggleMenuState" to="/studio/collaborations" class="lowercase">Collaborations</NuxtLink></li>
                                        <li><NuxtLink @click="toggleMenuState" to="/studio/interiors" class="lowercase">Interiors</NuxtLink></li>
                                        <li><NuxtLink @click="toggleMenuState" to="/studio/bespoke" class="lowercase">Bespoke</NuxtLink></li>
                                    </ul>
                                </div>
                            </Transition>
                        </li>
                        <li>
                            <button @click="isOurWorldMenuOpen = !isOurWorldMenuOpen" class="text-a1-bold uppercase text-left flex items-center gap-0.5">
                                <span>Our World</span>
                                <div class="transition-transform object-center duration-300" :class="isOurWorldMenuOpen ? 'rotate-45' : 'rotate-0'">
                                    <svg class="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                                    </svg>
                                </div>
                            </button>
                            <Transition name="fade">
                                <div v-if="isOurWorldMenuOpen" class="overflow-hidden max-h-48">
                                    <ul class="pt-2.5 pb-4 flex flex-col gap-2.5">
                                        <li><NuxtLink @click="toggleMenuState" to="/our-world/about-nada-debs" class="lowercase">About Nada Debs</NuxtLink></li>
                                        <li><NuxtLink @click="toggleMenuState" to="/our-world/crafts" class="lowercase">Contemporary Crafts</NuxtLink></li>
                                    </ul>
                                </div>
                            </Transition>
                        </li>
                    </ul>

                    <ul class="flex flex-col gap-2">
                        <li>
                            <button @click="isNewsMenuOpen = !isNewsMenuOpen" class="text-a2 font-medium uppercase text-left flex items-center gap-0.5">
                                <span>News</span>
                                <div class="transition-transform object-center duration-300" :class="isNewsMenuOpen ? 'rotate-45' : 'rotate-0'">
                                    <svg class="size-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                                    </svg>
                                </div>
                            </button>
                            <Transition name="fade">
                                <div v-if="isNewsMenuOpen" class="overflow-hidden max-h-48">
                                    <ul class="pt-3 pb-4 flex flex-col gap-1.5">
                                        <li><NuxtLink @click="toggleMenuState" to="/news/latest" class="lowercase">Latest</NuxtLink></li>
                                        <li><NuxtLink @click="toggleMenuState" to="/news/press" class="lowercase">Press</NuxtLink></li>
                                        <li><NuxtLink @click="toggleMenuState" to="/news/awards" class="lowercase">Awards</NuxtLink></li>
                                    </ul>
                                </div>
                            </Transition>
                        </li>
                        <li>
                            <button @click="isConnectMenuOpen = !isConnectMenuOpen" class="text-a2 font-medium uppercase text-left flex items-center gap-0.5">
                                <span>Connect</span>
                                <div class="transition-transform object-center duration-300" :class="isConnectMenuOpen ? 'rotate-45' : 'rotate-0'">
                                    <svg class="size-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                                    </svg>
                                </div>
                            </button>
                            <Transition name="fade">
                                <div v-if="isConnectMenuOpen" class="overflow-hidden max-h-48">
                                    <ul class="pt-3 pb-4 flex flex-col gap-1.5">
                                        <li><NuxtLink @click="toggleMenuState" to="/connect/find-us" class="lowercase">Find us</NuxtLink></li>
                                        <li><NuxtLink @click="toggleMenuState" to="/connect/contact-us" class="lowercase">Contact us</NuxtLink></li>
                                    </ul>
                                </div>
                            </Transition>
                        </li>
                        <li>
                            <button @click="isTradeMenuOpen = !isTradeMenuOpen" class="text-a2 font-medium uppercase text-left flex items-center gap-0.5">
                                <span>Trade</span>
                                <div class="transition-transform object-center duration-300" :class="isTradeMenuOpen ? 'rotate-45' : 'rotate-0'">
                                    <svg class="size-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                                    </svg>
                                </div>
                            </button>
                            <Transition name="fade">
                                <div v-if="isTradeMenuOpen" class="overflow-hidden max-h-48">
                                    <ul class="pt-3 pb-4 flex flex-col gap-1.5">
                                        <li><NuxtLink @click="toggleMenuState" to="/trade" class="lowercase">Make a request</NuxtLink></li>
                                    </ul>
                                </div>
                            </Transition>
                        </li>
                        <li>
                            <button @click="isWorkWithUsMenuOpen = !isWorkWithUsMenuOpen" class="text-a2 font-medium uppercase text-left flex items-center gap-0.5">
                                <span>Work with us</span>
                                <div class="transition-transform object-center duration-300" :class="isWorkWithUsMenuOpen ? 'rotate-45' : 'rotate-0'">
                                    <svg class="size-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                                    </svg>
                                </div>
                            </button>
                            <Transition name="fade">
                                <div v-if="isWorkWithUsMenuOpen" class="overflow-hidden max-h-48">
                                    <ul class="pt-3 pb-4 flex flex-col gap-1.5">
                                        <li><NuxtLink @click="toggleMenuState" to="/work-with-us" class="lowercase">Open positions</NuxtLink></li>
                                    </ul>
                                </div>
                            </Transition>
                        </li>
                        <li v-if="infoPages?.length > 0">
                            <button @click="isInfoMenuOpen = !isInfoMenuOpen" class="text-a2 font-medium uppercase text-left flex items-center gap-0.5">
                                <span>Info</span>
                                <div class="transition-transform object-center duration-300" :class="isInfoMenuOpen ? 'rotate-45' : 'rotate-0'">
                                    <svg class="size-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                                    </svg>
                                </div>
                            </button>
                            <Transition name="fade">
                                <div v-if="isInfoMenuOpen" class="overflow-hidden max-h-48">
                                    <ul class="pt-3 pb-4 flex flex-col gap-1.5">
                                        <li v-for="infoPage in infoPages" :key="infoPage._id">
                                            <NuxtLink @click="toggleMenuState" :to="`/info/${infoPage?.slug?.current}`" class="lowercase">{{ infoPage?.title }}</NuxtLink>
                                        </li>
                                    </ul>
                                </div>
                            </Transition>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

        <div 
            ref="topNav"
            class="absolute inset-x-0 top-0 pointer-events-auto p-4 sm:p-6 lg:px-8 xl:px-12 flex md:flex-row-reverse items-center justify-between md:gap-12 shrink-0 transition-colors duration-300"
            :class="{ 'text-white': isTopNavTransparent && route.name !== 'our-world-crafts-id' }"
        >
            <div class="hidden md:flex flex-1 items-center justify-end gap-6">
                <button @click="searchStore.setSearchOpen(true)" class="lowercase text-a2 font-medium">Search</button>
                <ClientOnly><ShopCountrySelector /></ClientOnly>
                <ShopBag @toggleCartDrawer="toggleCartDrawer" :cartItemCount />
            </div>

            <NuxtLink @click="menuState.isOpened = false" to="/" :class="{ 'text-black lg:text-inherit': menuState.isOpened }"><CommonHeaderBrandLogo /></NuxtLink>

            <div class="flex-1 flex items-center justify-end md:justify-start md:gap-12">
                <div class="flex md:flex-row-reverse items-center gap-2.5 md:relative" :class="{ 'text-black sm:text-inherit md:text-black': menuState.isOpened }">
                    <div class="md:hidden"><ShopBag @toggleCartDrawer="toggleCartDrawer" :cartItemCount /></div>
                    <div class="hidden md:block text-a2 font-medium lowercase">{{ parentRouteSlug }}</div>
                    <IconsDots class="w-2 h-auto" />
                    <button @click="toggleMenuState" class="lowercase text-a2 font-medium relative" aria-label="Toggle Menu">
                        <span :class="menuState.isOpened ? 'opacity-0' : 'opacity-100'">Menu</span>
                        <span class="absolute top-0 left-0" :class="menuState.isOpened ? 'opacity-100' : 'opacity-0'">Close</span>
                    </button>
                    <button @click="toggleMenuState" class="hidden md:flex absolute inset-0 cursor-pointer" aria-label="Toggle Menu"></button>
                </div>

                <div class="hidden xl:flex justify-center flex-grow text-a2 lowercase">
                    <ul v-if="route.path.startsWith('/shop/')" class="flex gap-6">
                        <li>
                            <NuxtLink 
                                to="/shop/objects" 
                                class="hover:opacity-100 transition-opacity duration-300"
                                :class="isObjectsActive ? 'font-medium opacity-100' : 'font-light opacity-30'"
                            >Objects</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink 
                                to="/shop/furniture" 
                                class="hover:opacity-100 transition-opacity duration-300"
                                :class="isFurnitureActive ? 'font-medium opacity-100' : 'font-light opacity-30'"
                            >Furniture</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink 
                                to="/shop/collections" 
                                class="hover:opacity-100 transition-opacity duration-300"
                                :class="route.path === '/shop/collections' || route.name === 'shop-collections-id' ? 'font-medium opacity-100' : 'font-light opacity-30'"
                            >Collections</NuxtLink>
                        </li>
                    </ul>
                    <ul v-if="route.path.startsWith('/studio/')" class="flex gap-6">
                        <li>
                            <NuxtLink 
                                to="/studio/collaborations" 
                                class="hover:opacity-100 transition-opacity duration-300"
                                :class="route.path === '/studio/collaborations' || route.name === 'studio-collaborations-id' ? 'font-medium opacity-100' : 'font-light opacity-30'"
                            >Collaborations</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink 
                                to="/studio/interiors" 
                                class="hover:opacity-100 transition-opacity duration-300"
                                :class="route.path === '/studio/interiors' || route.name === 'studio-interiors-id' ? 'font-medium opacity-100' : 'font-light opacity-30'"
                            >Interiors</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink 
                                to="/studio/bespoke" 
                                class="hover:opacity-100 transition-opacity duration-300"
                                :class="route.path === '/studio/bespoke' ? 'font-medium opacity-100' : 'font-light opacity-30'"
                            >Bespoke</NuxtLink>
                        </li>
                    </ul>
                    <ul v-if="route.path.startsWith('/our-world/')" class="flex gap-6">
                        <li>
                            <NuxtLink 
                                to="/our-world/about-nada-debs" 
                                class="hover:opacity-100 transition-opacity duration-300"
                                :class="route.path === '/our-world/about-nada-debs' ? 'font-medium opacity-100' : 'font-light opacity-30'"
                            >About Nada Debs</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink 
                                to="/our-world/crafts" 
                                class="hover:opacity-100 transition-opacity duration-300"
                                :class="route.path === '/our-world/crafts' || route.name === 'our-world-crafts-id' ? 'font-medium opacity-100' : 'font-light opacity-30'"
                            >Contemporary Crafts</NuxtLink>
                        </li>
                    </ul>
                    <ul v-if="route.path.startsWith('/news/')" class="flex gap-6">
                        <li>
                            <NuxtLink
                                to="/news/latest"
                                class="hover:opacity-100 transition-opacity duration-300"
                                :class="route.path === '/news/latest' || route.name === 'news-latest-id' ? 'font-medium opacity-100' : 'font-light opacity-30'"
                            >Latest</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink
                                to="/news/press"
                                class="hover:opacity-100 transition-opacity duration-300"
                                :class="route.path === '/news/press' ? 'font-medium opacity-100' : 'font-light opacity-30'"
                            >Press</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink
                                to="/news/awards"
                                class="hover:opacity-100 transition-opacity duration-300"
                                :class="route.path === '/news/awards' ? 'font-medium opacity-100' : 'font-light opacity-30'"
                            >Awards</NuxtLink>
                        </li>
                    </ul>
                    <ul v-if="route.path.startsWith('/connect/')" class="flex gap-6">
                        <li>
                            <NuxtLink
                                to="/connect/find-us"
                                class="hover:opacity-100 transition-opacity duration-300"
                                :class="route.path === '/connect/find-us' ? 'font-medium opacity-100' : 'font-light opacity-30'"
                            >Find us</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink
                                to="/connect/contact-us"
                                class="hover:opacity-100 transition-opacity duration-300"
                                :class="route.path === '/connect/contact-us' ? 'font-medium opacity-100' : 'font-light opacity-30'"
                            >Contact us</NuxtLink>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'
import { useCurrentProductStore } from '@/stores/currentProduct'
import { useSearchStore } from '@/stores/search'

const props = defineProps({
    infoPages: {
        type: Array,
        required: false,
    },
})

const menuState = useMenuStore()
const cartStore = useCartStore()
const currentProductStore = useCurrentProductStore()
const searchStore = useSearchStore()
const route = useRoute()

const parentRouteSlug = computed(() => {
    if (route.path.startsWith('/shop')) {
        return 'Shop'
    }
    else if (route.path.startsWith('/studio')) {
        return 'Studio'
    }
    else if (route.path.startsWith('/our-world')) {
        return 'Our World'
    }
    else if (route.path.startsWith('/news')) {
        return 'News'
    }
    else if (route.path.startsWith('/connect')) {
        return 'Connect'
    }
    else if (route.path.startsWith('/trade')) {
        return 'Trade'
    }
    else if (route.path.startsWith('/work-with-us')) {
        return 'Work with us'
    }

    return 'Nada Debs'
})

// Computed properties for product category highlighting
const isMounted = ref(false)

const isObjectsActive = computed(() => {
    if (route.path === '/shop/objects') return true
    if (isMounted.value && route.name === 'shop-id' && currentProductStore.currentProduct?.category === 'objects') return true
    return false
})

const isFurnitureActive = computed(() => {
    if (route.path === '/shop/furniture') return true
    if (isMounted.value && route.name === 'shop-id' && currentProductStore.currentProduct?.category === 'furniture') return true
    return false
})

const topNav = ref(null)
const isTopNavTransparent = ref(false)

const isShopMenuOpen = ref(false)
const isStudioMenuOpen = ref(false)
const isOurWorldMenuOpen = ref(false)
const isNewsMenuOpen = ref(false)
const isConnectMenuOpen = ref(false)
const isWorkWithUsMenuOpen = ref(false)
const isTradeMenuOpen = ref(false)
const isInfoMenuOpen = ref(false)

const headerBgClass = computed(() => {
    if (
        isTopNavTransparent.value 
        || route.name === 'studio'
        || route.name === 'shop'
    ) {
        return 'bg-transparent'
    }
    if (route.path.startsWith('/studio/')) {
        return 'bg-beige'
    }
    if (route.path.startsWith('/shop/')) {
        return 'bg-white'
    }

    return 'bg-sand'
})

const updateTopNavBg = () => {
    if (
        route.name === 'our-world-about-nada-debs' 
        || route.name === 'our-world-crafts-id' 
        || route.name === 'news-latest-id'
        || route.name === 'shop-collections-id'
    ) {
        const windowHeight = window.innerHeight
        const topNavHeight = topNav.value.offsetHeight
        const scrollY = window.scrollY
        isTopNavTransparent.value = scrollY >= 0 && scrollY <= windowHeight - (topNavHeight / 2)
    } else {
        isTopNavTransparent.value = false
    }
}

const toggleMenuState = () => {
    menuState.isOpened = !menuState.isOpened
}

const openSearch = () => {
    menuState.isOpened = false
    searchStore.setSearchOpen(true)
}

const toggleCartDrawer = () => {
    cartStore.setCartOpen(!cartStore.isCartOpen)
}

const cartItemCount = computed(() => {
    return cartStore.cart?.lineItems?.reduce((total, item) => total + item.quantity, 0) || 0
})

watch(() => route.name, () => {
    updateTopNavBg()
})

onMounted(() => {
    window.addEventListener('scroll', updateTopNavBg)
    isTopNavTransparent.value = (
        route.name === 'our-world-about-nada-debs' 
        || route.name === 'our-world-crafts-id' 
        || route.name === 'news-latest-id'
        || route.name === 'shop-collections-id'
    ) && window.scrollY === 0
    
    // Set mounted state to true after component is mounted
    isMounted.value = true
})

onUnmounted(() => {
    window.removeEventListener('scroll', updateTopNavBg)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease, max-height 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    max-height: 0;
}
</style>
