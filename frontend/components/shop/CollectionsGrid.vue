<template>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-3.5">
        <div v-for="collection in collections" :key="collection._id">
            <NuxtLink :to="`/shop/collections/${collection.slug.current}`" class="group">
                <div class="relative overflow-hidden aspect-video group-hover:opacity-50 transition-opacity duration-300">
                    <CommonMediaImage
                        :image="collection.thumbnail || collection.cover"
                        :alt="collection.title"
                        width="1024"
                        mobileWidth="1024"
                        class="w-full h-full object-cover"
                    />
                </div>

                <CommonGridCaption>
                    <h2 class="text-h2 uppercase flex flex-col">{{ collection.title }}</h2>

                    <div v-if="collection.year" class="text-p2 opacity-30">
                        {{ collection.year }}
                    </div>
                </CommonGridCaption>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    collections: {
        type: Array,
        required: true,
    },
})
</script>