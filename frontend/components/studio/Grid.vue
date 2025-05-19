<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 md:gap-y-12 xl:gap-y-16 gap-x-2 pb-12">
        <div 
            v-for="item in items" 
            :key="item._id"
            :class="showFeatured &&item.isFeatured ? 'sm:col-span-2 lg:row-span-2' : ''"
        >
            <NuxtLink 
                :to="`${route}/${item.slug.current}`"
                :class="showFeatured && item.isFeatured ? 'lg:flex lg:flex-col lg:h-full' : ''"
            >
                <div 
                    class="relative overflow-hidden"
                    :class="showFeatured && item.isFeatured ? 'aspect-square sm:aspect-auto lg:flex-grow' : 'aspect-[3/2]'"
                >
                    <CommonMediaImage
                        :image="item.featuredImage"
                        :alt="item.title"
                        :width="showFeatured && item.isFeatured ? '1024' : '512'"
                        mobileWidth="384"
                        class="w-full h-full object-cover"
                    />
                </div>

                <div class="px-4 mt-2.5 lg:mt-5">
                    <h2 class="text-h2 uppercase flex flex-col gap-1.5">
                        <span v-if="isCollaboration" class="font-light">Nada Debs x</span>
                        <span>{{ item.title }}</span>
                    </h2>

                    <div v-if="!isCollaboration && item?.year" class="text-p2 mt-1.5">
                        <span v-if="item?.location">{{ item.location }}, </span>
                        <span v-if="item?.year">{{ item.year }}</span>
                    </div>
                </div>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    items: {
        type: Array,
        default: [],
        required: true,
    },
    showFeatured: {
        type: Boolean,
        default: false,
        required: false,
    },
    isCollaboration: {
        type: Boolean,
        default: false,
        required: false,
    },
    route: {
        type: String,
        default: '',
        required: true,
    },
})
</script>