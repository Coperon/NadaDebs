<template>
    <div id="main-content-wrapper" class="flex flex-col min-h-svh">

        <!-- Header -->
        <CommonHeader :infoPages="infoPages" />

        <!-- Main content -->
        <main
            id="main-content"
            class="relative flex flex-1 flex-col h-full max-w-full transition-opacity duration-300 ease-in-out"
            :class="{
                'opacity-0': !loaded
            }"
        >
            <slot />
        </main>

        <!-- Footer -->
        <CommonFooter v-if="route.name !== 'studio' && route.name !== 'shop'" :infoPages="infoPages" />

        <!-- Shop Cart Drawer -->
        <ShopCartDrawer :cart="cartStore.cart" @close="cartStore.setCartOpen(false)" />

        <!-- Search Drawer -->
        <CommonSearchDrawer @close="searchStore.setSearchOpen(false)" />
        
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
import { useSearchStore } from '@/stores/search'
import { getInfoPages } from '@/data/infoPages'

const infoPages = await getInfoPages()
const loaded = ref(false)
const route = useRoute()
const siteSettingsData = inject('siteSettingsData')
const cartStore = useCartStore()
const searchStore = useSearchStore()

onMounted(() => {
    loaded.value = true
})
</script>
