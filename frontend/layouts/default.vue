<template>
    <div id="main-content-wrapper" class="flex flex-col min-h-svh">

        <!-- Header -->
        <CommonHeader />

        <!-- Main content -->
        <main
            id="main-content"
            class="relative flex flex-1 flex-col h-full max-w-full p-2"
        >
            <slot />
        </main>

        <!-- Footer -->
        <CommonFooter v-if="route.name !== 'studio'" />

        <!-- Shop Cart Drawer -->
        <!-- <ShopCartDrawer :cart="cartStore.cart" :isOpen="cartStore.isCartOpen" @close="cartStore.setCartOpen(false)" /> -->
        
        <!-- Cookie Banner -->
        <ClientOnly>
            <CommonCookieBanner
                v-if="siteSettingsData?.gtmID"
                :cookiesPolicyLink="`/${siteSettingsData?.cookiesPolicyLink?.slug}`"
                :bannerData="siteSettingsData?.cookieNotice"
            />
        </ClientOnly>
    </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const siteSettingsData = inject('siteSettingsData')
const cartStore = useCartStore()
</script>
