<template>
    <div>
        <div v-if="categories && categories.length > 0" class="text-a2 mb-8 text-center">
            <button 
                @click="selectedCategory = null"
                :class="{ 'font-medium': selectedCategory === null }"
            >All</button>
            <template v-for="category in categories" :key="category._id">
                <span>, </span>
                <button 
                    @click="selectedCategory = category._id"
                    :class="{ 'font-medium': selectedCategory === category._id }"
                >{{ category.title }}</button>
            </template>
        </div>

        <Transition name="fade" mode="out-in">
            <div 
                :key="selectedCategory"
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 md:gap-y-12 xl:gap-y-16 gap-x-2.5"
            >
                <div 
                    v-for="item in filteredItems" 
                    :key="item._id"
                    :class="showFeatured && item.isFeatured ? 'sm:col-span-2 lg:row-span-2' : ''"
                >
                    <NuxtLink 
                        :to="`${route}/${item.slug.current}`"
                        class="group"
                        :class="showFeatured && item.isFeatured ? 'lg:flex lg:flex-col lg:h-full' : ''"
                    >
                        <div 
                            class="relative overflow-hidden group-hover:opacity-50 transition-opacity duration-300"
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
                            <h2 class="text-h2 uppercase flex flex-col">
                                <span v-if="isCollaboration" class="font-light">Nada Debs x</span>
                                <span>{{ item.title }}</span>
                            </h2>

                            <div v-if="!isCollaboration && item?.year" class="text-p2">
                                <span v-if="item?.location">{{ item.location }}, </span>
                                <span v-if="item?.year">{{ item.year }}</span>
                            </div>
                        </div>
                    </NuxtLink>
                </div>
            </div>
        </Transition>
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
    categories: {
        type: Array,
        default: [],
        required: false,
    },
})

const selectedCategory = ref(null)

const filteredItems = computed(() => {
    if (!selectedCategory.value) {
        return props.items
    }
    return props.items.filter(item => item.category?._id === selectedCategory.value)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>