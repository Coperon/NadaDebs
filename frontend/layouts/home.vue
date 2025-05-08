<template>
    <div class="text-light-gray">
        <header class="fixed inset-x-0 top-0 z-10 flex justify-center items-center py-5">
            <h1><CommonHeaderBrandLogo /></h1>
        </header>

        <main id="main-content">
            <slot />
        </main>

        <footer class="fixed inset-x-0 bottom-0 z-10 flex justify-center items-center py-8">
            <IconsHandmadeHeartmade class="h-[1.625rem] w-auto" />
        </footer>

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
const siteSettingsData = inject('siteSettingsData')
</script>