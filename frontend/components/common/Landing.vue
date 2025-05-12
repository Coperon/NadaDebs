<template>
    <div class="fixed inset-0">
        <div class="fixed inset-0">
            <div class="opacity-0 transition-opacity duration-500" :class="{ 'opacity-100': activeImage === 'default' }">
                <CommonLandingMedia
                    :image="imageDefault"
                    :videoUrl="videoDefaultUrl"
                />
            </div>
            <div class="opacity-0 transition-opacity duration-500" :class="{ 'opacity-100': activeImage === 'left' }">
                <CommonLandingMedia
                    :image="imageLeft"
                    :videoUrl="videoLeftUrl"
                />
            </div>
            <div class="opacity-0 transition-opacity duration-500" :class="{ 'opacity-100': activeImage === 'center' }">
                <CommonLandingMedia
                    :image="imageCenter"
                    :videoUrl="videoCenterUrl"
                />
            </div>
            <div class="opacity-0 transition-opacity duration-500" :class="{ 'opacity-100': activeImage === 'right' }">
                <CommonLandingMedia
                    :image="imageRight"
                    :videoUrl="videoRightUrl"
                />
            </div>
        </div>

        <div class="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
            <ul class="flex flex-col items-center gap-2.5 lg:flex-row lg:w-full">
                <li 
                    class="uppercase lg:flex-1 text-center transition-all duration-300 ease-in-out" 
                    :class="activeImage === 'center' || activeImage === 'right' ? 'text-a1-light opacity-30' : 'text-a1-bold'"
                >
                    <NuxtLink 
                        :to="leftUrl"
                        @mouseenter="activeImage = 'left'"
                        @mouseleave="activeImage = 'default'"
                    >{{ leftLabel }}</NuxtLink>
                </li>
                <li 
                    class="uppercase lg:flex-1 text-center transition-all duration-300 ease-in-out" 
                    :class="activeImage === 'left' || activeImage === 'right' ? 'text-a1-light opacity-30' : 'text-a1-bold'"
                >
                    <NuxtLink
                        :to="centerUrl"
                        @mouseenter="activeImage = 'center'"
                        @mouseleave="activeImage = 'default'"
                    >{{ centerLabel }}</NuxtLink>
                </li>
                <li 
                    class="uppercase lg:flex-1 text-center transition-all duration-300 ease-in-out" 
                    :class="activeImage === 'center' || activeImage === 'left' ? 'text-a1-light opacity-30' : 'text-a1-bold'"
                >
                    <NuxtLink
                        :to="rightUrl"
                        @mouseenter="activeImage = 'right'"
                        @mouseleave="activeImage = 'default'"
                    >{{ rightLabel }}</NuxtLink>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    imageDefault: Object,
    videoDefaultUrl: String,
    imageLeft: Object,
    videoLeftUrl: String,
    imageCenter: Object,
    videoCenterUrl: String,
    imageRight: Object,
    videoRightUrl: String,
    leftLabel: String,
    centerLabel: String,
    rightLabel: String,
    leftUrl: String,
    centerUrl: String,
    rightUrl: String
})

const activeImage = ref('default')
</script>