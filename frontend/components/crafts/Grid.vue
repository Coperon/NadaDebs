<template>
    <div
        v-if="crafts && crafts.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 md:gap-y-12 xl:gap-y-16 gap-x-3.5"
    >
        <div v-for="craft in crafts" :key="craft._id">
            <NuxtLink
                v-if="craft.slug?.current"
                :to="`/our-world/crafts/${craft.slug.current}`"
                class="group"
            >
                <div
                    v-if="craft?.thumbnail?.image"
                    class="relative overflow-hidden aspect-[3/2]"
                >
                    <CommonMediaImage
                        :image="craft.thumbnail.image"
                        :alt="craft.title"
                        width="512"
                        mobileWidth="384"
                        class="w-full h-full object-cover"
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

                <CommonGridCaption>
                    <h2 class="text-a1-bold uppercase">{{ craft.title }}</h2>
                </CommonGridCaption>
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
