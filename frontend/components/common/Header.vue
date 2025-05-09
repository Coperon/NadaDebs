<template>
    <header 
        id="header" 
        ref="header" 
        class="fixed inset-0 h-screen z-10 flex flex-col transition-colors duration-300"
        :class="menuState.isOpened ? 'pointer-events-auto bg-white' : 'pointer-events-none bg-sand'"
    >
        <div class="pointer-events-auto p-4 flex items-center justify-between shrink-0">
            <NuxtLink to="/"><CommonHeaderBrandLogo /></NuxtLink>

            <div class="flex items-center gap-2.5">
                <ShopBag @toggleCartDrawer="toggleCartDrawer" :cartItemCount />
                <IconsDots class="w-2 h-auto" />
                <button @click="toggleMenuState" class="lowercase text-a2 font-medium relative" aria-label="Toggle Menu">
                    <span :class="menuState.isOpened ? 'opacity-0' : 'opacity-100'">Menu</span>
                    <span class="absolute top-0 left-0" :class="menuState.isOpened ? 'opacity-100' : 'opacity-0'">Close</span>
                </button>
            </div>
        </div>

        <div v-if="menuState.isOpened" class="flex-grow px-4 pb-6 flex flex-col gap-8 overflow-y-auto">
            <div class="shrink-0 border-t border-b border-current py-1.5 flex items-center text-a2 font-medium lowercase">
                <div class="flex-1 pr-2-5 py-1">Search</div>
                <div class="flex-1 pl-2.5 py-1 border-l border-current">Favorites (3)</div>
            </div>

            <nav class="flex-grow flex flex-col justify-between gap-12">
                <ul class="flex flex-col gap-2">
                    <li>
                        <button @click="isShopMenuOpen = !isShopMenuOpen" class="text-a1-bold uppercase text-left">
                            Shop
                            <span class="transition-transform object-center duration-300 inline-block" :class="isShopMenuOpen ? 'rotate-45' : 'rotate-0'">+</span>
                        </button>
                        <ul v-if="isShopMenuOpen" class="pt-2.5 pb-4 flex flex-col gap-2.5">
                            <li><NuxtLink to="" class="lowercase">Objects</NuxtLink></li>
                            <li><NuxtLink to="" class="lowercase">Furniture</NuxtLink></li>
                            <li><NuxtLink to="" class="lowercase">Collections</NuxtLink></li>
                        </ul>
                    </li>
                    <li>
                        <button class="text-a1-bold uppercase text-left">
                            Studio
                            <span>+</span>
                        </button>
                        <ul class="pt-2.5 pb-4 flex flex-col gap-2.5">
                            <li><NuxtLink to="" class="lowercase">Collaborations</NuxtLink></li>
                            <li><NuxtLink to="" class="lowercase">Interiors</NuxtLink></li>
                            <li><NuxtLink to="" class="lowercase">Bespoke</NuxtLink></li>
                        </ul>
                    </li>
                    <li>
                        <button class="text-a1-bold uppercase text-left">
                            Our World
                            <span>+</span>
                        </button>
                        <ul class="pt-2.5 pb-4 flex flex-col gap-2.5">
                            <li><NuxtLink to="" class="lowercase">About Nada Debs</NuxtLink></li>
                            <li><NuxtLink to="" class="lowercase">Contemporary Crafts</NuxtLink></li>
                        </ul>
                    </li>
                </ul>

                <ul class="flex flex-col gap-2">
                    <li>
                        <button class="text-a2 font-medium uppercase">
                            News
                            <span>+</span>
                        </button>
                    </li>
                    <li>
                        <button class="text-a2 font-medium uppercase">
                            Connect
                        </button>
                    </li>
                    <li>
                        <button class="text-a2 font-medium uppercase">
                            Work with us
                        </button>
                    </li>
                    <li>
                        <button class="text-a2 font-medium uppercase">
                            Trade
                        </button>
                    </li>
                    <li>
                        <button class="text-a2 font-medium uppercase">
                            Info
                            <span>+</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>



        <!-- <nav
            id="main-nav"
            class="flex justify-between sticky top-0 left-0 w-full p-2 border-b leading-none"
        >
            <NuxtLink
                to="/"
                class="flex transition-colors"
                active-class="text-blue"
            >
               <CommonHeaderBrandLogo />
            </NuxtLink>
            <div
                class="ml-auto flex items-center gap-x-2 h-[2em]"
                v-if="navItems && navItems?.length > 0"
            >
                <CommonHeaderPrimaryNav
                    :menuIsOpened="menuState.isOpened"
                    :items="navItems"
                />
                <button @click="toggleMenuState" class="h-[1em] md:hidden" aria-label="Toggle nav menu">
                    <IconsBurger :menuIsOpened="menuState.isOpened" />
                </button>
            </div>
            <ShopBag @toggleCartDrawer="toggleCartDrawer" :cartItemCount />
        </nav> -->
    </header>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const menuState = useMenuStore()
const cartStore = useCartStore()
const isShopMenuOpen = ref(false)

const toggleMenuState = () => {
    menuState.isOpened = !menuState.isOpened
}

const toggleCartDrawer = () => {
    cartStore.setCartOpen(!cartStore.isCartOpen)
}

const cartItemCount = computed(() => {
    return cartStore.cart?.lineItems?.reduce((total, item) => total + item.quantity, 0) || 0
})

const header = ref(null)

onBeforeMount(() => {
    // add matchmedia to open or close menu both on load or on change
    const mq = window.matchMedia('(min-width: 768px)')
    menuState.isOpened = mq.matches

    mq.addEventListener('change', e => {
        if (e.matches) {
            menuState.isOpened = true
        } else {
            menuState.isOpened = false
        }
    })
})
</script>
