<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem] pb-20 sm:pb-24 lg:pb-30">
        <CommonPageHeader 
            :title="objectsPageData?.title" 
            :description="objectsPageData?.description" 
        />

        <!-- Category Filter -->
        <div class="px-4 sm:px-6 lg:px-8 xl:px-12 flex justify-end mb-4">
            <button @click="isFilterOpen = !isFilterOpen" class="text-a2 font-medium lowercase">
                Filter ({{ selectedCategory ? '1' : '0' }}) +
            </button>
        </div>

        <div class="fixed z-50 inset-0 transition-opacity duration-300" :class="isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'">
            <div class="absolute inset-0 bg-beige/20" @click="isFilterOpen = false"></div>
            <div class="absolute inset-y-0 right-0 bg-white w-full sm:max-w-[24rem] pt-[3.25rem] sm:pt-[4.25rem] px-4 sm:px-6 lg:px-8 xl:px-12">
                <div class="flex justify-end">
                    <button @click="isFilterOpen = false" class="text-a2 font-medium lowercase">Filter -</button>
                </div>

                <div class="mt-12 flex flex-col gap-12">
                    <div>
                        <div class="flex justify-start">
                            <button @click="isTypeListOpen = !isTypeListOpen" class="text-a2 font-medium uppercase">Type {{ isTypeListOpen ? '-' : '+' }}</button>
                        </div>

                        <ul v-if="isTypeListOpen" class="mt-2 columns-2 gap-8">
                            <li 
                                v-for="type in categoriesWithProducts" 
                                :key="type._id" 
                                class="mb-1.5 flex items-center gap-3 before:content-[''] before:block before:w-1 before:h-1 before:rounded-full before:transition-colors"
                                :class="selectedCategory === type.slug.current ? 'font-medium before:bg-black' : 'font-light before:bg-transparent'"
                            >
                                <button @click="selectedCategory = selectedCategory === type.slug.current ? null : type.slug.current" class="lowercase">{{ type.title }}</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="displayedItems.length > 0" class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-2.5 gap-y-8 md:gap-y-12 xl:gap-y-16">
            <div v-for="object in displayedItems" :key="object._id" :class="object.isFeatured ? 'col-span-2' : ''">
                <NuxtLink :to="`/shop/${object.store.slug.current}`" class="group">
                    <div v-if="object?.featuredImage" class="relative overflow-hidden bg-beige/30" :class="object.isFeatured ? 'aspect-auto' : 'aspect-[4/5]'">
                        <CommonMediaImage
                            :image="object.featuredImage"
                            :alt="object.store.title"
                            :width="object.isFeatured ? '768' : '384'"
                            :mobileWidth="object.isFeatured ? '768' : '384'"
                            class="w-full h-full object-contain"
                            :class="object.isFeatured ? 'absolute inset-0' : ''"
                        />
                        <CommonMediaImage
                            v-if="object?.secondaryImage"
                            :image="object.secondaryImage"
                            :alt="object.store.title"
                            :width="object.isFeatured ? '768' : '384'"
                            :mobileWidth="object.isFeatured ? '768' : '384'"
                            class="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                        <div v-if="object.isFeatured" class="flex gap-x-2.5 w-full pointer-events-none">
                            <div class="aspect-[4/5] flex-1"></div>
                            <div class="aspect-[4/5] flex-1"></div>
                        </div>
                    </div>

                    <div class="px-4 mt-2.5 lg:mt-5">
                        <h2 class="text-h2">{{ object.store.title }}</h2>
                        <div class="mt-1.5 text-grey group-hover:text-black transition-colors">
                            <ShopProductPrice :productGid="object?.store?.gid" :price="object?.store?.priceRange" />
                        </div>
                    </div>
                </NuxtLink>
            </div>
        </div>

        <div v-if="hasMoreItems" class="mt-12 flex justify-center">
            <button 
                @click="loadMore"
                class="text-a2 text-grey lowercase hover:text-black transition-colors"
            >
                Load More +
            </button>
        </div>
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getObjectsPage } from '@/data/objectsPage'
import { getObjects } from '@/data/objects'
import { getObjectsCategories } from '@/data/objectsCategories'

const objectsPageData = await getObjectsPage()
const categories = await getObjectsCategories()
const allProducts = await getObjects()

const selectedCategory = ref(null)
const itemsPerPage = 24
const currentPage = ref(1)
const isFilterOpen = ref(false)
const isTypeListOpen = ref(true)

watch(isFilterOpen, (newValue) => {
    if (process.client) {
        document.body.classList.toggle('overflow-hidden', newValue)
    }
})

const filteredProducts = computed(() => {
    if (!selectedCategory.value) return allProducts.value?.items || []
    return allProducts.value?.items?.filter(product => 
        product.objectsCategory?.slug?.current === selectedCategory.value
    ) || []
})

const categoriesWithProducts = computed(() => {
    if (!categories.value || !allProducts.value?.items) return []
    
    return categories.value.filter(category => 
        allProducts.value.items.some(product => 
            product.objectsCategory?.slug?.current === category.slug.current
        )
    )
})

const displayedItems = computed(() => {
    const end = currentPage.value * itemsPerPage
    return filteredProducts.value.slice(0, end)
})

const hasMoreItems = computed(() => {
    return displayedItems.value.length < filteredProducts.value.length
})

const loadMore = () => {
    currentPage.value++
}

watch(selectedCategory, () => {
    currentPage.value = 1
})

useSeoObject(objectsPageData?.seo, objectsPageData?.title)
</script>
