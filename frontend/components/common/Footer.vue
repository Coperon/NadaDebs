<template>
    <footer class="px-4 py-8 sm:px-6 lg:px-8 lg:py-12 xl:px-12 xl:py-16">
        <div class="flex justify-center">
            <CommonFooterMailchimpSubscription />
        </div>

        <div class="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-12 gap-x-8 sm:text-center">
            <div class="flex flex-col gap-3">
                <h2 class="text-a2 font-medium uppercase">News</h2>
                <ul class="flex flex-col gap-1.5">
                    <li><NuxtLink to="/news/latest" class="lowercase">Latest</NuxtLink></li>
                    <li><NuxtLink to="/news/press" class="lowercase">Press</NuxtLink></li>
                    <li><NuxtLink to="/news/awards" class="lowercase">Awards</NuxtLink></li>
                </ul>
            </div>
            <div class="flex flex-col gap-3">
                <h2 class="text-a2 font-medium uppercase">Connect</h2>
                <ul class="flex flex-col gap-1.5">
                    <li><NuxtLink to="/connect/find-us" class="lowercase">Find us</NuxtLink></li>
                    <li><NuxtLink to="/connect/contact-us" class="lowercase">Contact us</NuxtLink></li>
                </ul>
            </div>
            <div class="flex flex-col gap-3">
                <h2 class="text-a2 font-medium uppercase">Work with us</h2>
                <ul class="flex flex-col gap-1.5">
                    <li><NuxtLink to="" class="lowercase">Open positions</NuxtLink></li>
                </ul>
            </div>
            <div class="flex flex-col gap-3">
                <h2 class="text-a2 font-medium uppercase">Trade</h2>
                <ul class="flex flex-col gap-1.5">
                    <li><NuxtLink to="" class="lowercase">Make a request</NuxtLink></li>
                </ul>
            </div>
            <div v-if="infoPages?.length > 0" class="flex flex-col gap-3">
                <h2 class="text-a2 font-medium uppercase">Info</h2>
                <ul class="flex flex-col gap-1.5">
                    <li v-for="infoPage in infoPages" :key="infoPage._id">
                        <NuxtLink :to="`/info/${infoPage?.slug?.current}`" class="lowercase">{{ infoPage?.title }}</NuxtLink>
                    </li>
                </ul>
            </div>
            <div v-if="siteSettingsData?.socialLinks?.length > 0" class="flex flex-col gap-3">
                <h2 class="text-a2 font-medium uppercase">Follow us</h2>
                <ul class="flex gap-2 sm:justify-center">
                    <li v-for="socialLink in siteSettingsData?.socialLinks" :key="socialLink._key">
                        <a :href="socialLink?.url" target="_blank">
                            <img :src="socialLink?.icon?.asset?.url" :alt="socialLink?.title" class="w-6 h-6 object-contain" />
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </footer>
</template>

<script setup>
const siteSettingsData = inject('siteSettingsData')

const props = defineProps({
    infoPages: {
        type: Array,
        required: false,
    },
})
</script>
