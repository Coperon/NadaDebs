<template>
    <header id="header" ref="header" class="left-0 w-full uppercase bg-white">
        <nav
            id="main-nav"
            class="flex justify-between sticky top-0 left-0 w-full p-2 border-b leading-none"
        >
            <NuxtLink
                to="/"
                class="flex transition-colors"
                active-class="text-blue"
            >
               <CommonHeaderBrandLogo :siteLogo="siteLogo" :siteName="siteName" />
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
        </nav>
    </header>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const menuState = useMenuStore()
const cartStore = useCartStore()

const props = defineProps({
    siteName: String,
    siteLogo: String,
    navItems: Array,
})

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
