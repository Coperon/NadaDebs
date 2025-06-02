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
        <ShopCartDrawer :cart="cartStore.cart" @close="cartStore.setCartOpen(false)" />

        <!-- Country Selector -->
        <!-- <ClientOnly>
            <CountrySelector />
        </ClientOnly> -->
        
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
import CountrySelector from '@/components/shop/CountrySelector.vue'
import { useCountryStore } from '@/stores/country'
const infoPages = await getInfoPages()

const route = useRoute()
const siteSettingsData = inject('siteSettingsData')
const cartStore = useCartStore()
const countryStore = useCountryStore()
</script>
