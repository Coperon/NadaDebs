<template>
    <div v-if="crafts && crafts.length > 0" class="px-4 sm:px-6 lg:px-8 xl:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 sm:gap-y-16 md:gap-x-16 md:gap-y-24 xl:gap-y-30 xl:gap-x-20">
        <div v-for="craft in crafts" :key="craft._id">
            <NuxtLink :to="`/our-world/crafts/${craft.slug.current}`" class="flex gap-2 group">
                <div v-if="craft.thumbnail.image" class="w-2/5 aspect-[23/29] shrink-0 relative">
                    <div class="relative overflow-hidden h-full">
                        <CommonMediaImage
                            :image="craft.thumbnail.image"
                            :alt="craft.title"
                            width="384"
                            mobileWidth="384"
                            class="absolute inset-0 w-full h-full object-cover"
                        />
                        <video
                            v-if="craft.thumbnail.video"
                            muted
                            loop
                            autoplay
                            playsinline
                            :src="craft.thumbnail.video"
                            class="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                    </div>

                    <div class="absolute bottom-4 left-0 -translate-x-1/2 w-9 h-auto text-primary-button opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <IconsDots class="w-full h-auto" />
                    </div>
                </div>

                <div class="w-3/5">
                    <h2 class="text-h2">{{ craft.title }}</h2>
                    <div v-if="craft.briefDescription" class="text-p2 mt-2 line-clamp-5">
                        {{ craft.briefDescription }}
                    </div>
                </div>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
defineProps({
    crafts: {
        type: Array,
        required: true,
    },
})
</script>