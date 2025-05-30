<template>
    <div id="main-content-wrapper" class="flex flex-col min-h-svh">

        <!-- Header -->
        <CommonHeader :infoPages="infoPages" />

        <!-- Main content -->
        <main
            id="main-content"
            class="relative flex flex-1 flex-col h-full max-w-full"
        >
            <slot />
        </main>

        <!-- Footer -->
        <CommonFooter v-if="route.name !== 'studio'" :infoPages="infoPages" />

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
import { getInfoPages } from '@/data/infoPages'

const infoPages = await getInfoPages()

const route = useRoute()
const siteSettingsData = inject('siteSettingsData')
const cartStore = useCartStore()
</script>
