<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem] pb-20 sm:pb-24 lg:pb-30">
        <CommonPageHeader 
            :title="objectsPageData?.title" 
            :description="objectsPageData?.description" 
        />

        <!-- Filters -->
        <div class="px-4 sm:px-6 lg:px-8 xl:px-12 flex justify-end mb-4 md:mb-6 xl:mb-8">
            <button @click="isFilterOpen = !isFilterOpen" class="text-a2 font-medium lowercase">
                Filter ({{ filterText }}) +
            </button>
        </div>

        <div class="fixed z-50 inset-0 transition-opacity duration-300" :class="[isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none']">
            <div class="absolute inset-0 bg-beige/20" @click="isFilterOpen = false"></div>
            <div class="absolute inset-y-0 right-0 bg-white w-full sm:max-w-[24rem] overflow-y-auto">
                <div class="flex justify-end sticky top-0 px-4 sm:px-6 lg:px-8 xl:px-12 h-[3.25rem] sm:h-[4.25rem]">
                    <button @click="isFilterOpen = false" class="text-a2 font-medium lowercase">Filter -</button>
                </div>

                <div class="py-12 flex flex-col gap-12 px-4 sm:px-6 lg:px-8 xl:px-12">
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

                    <div>
                        <div class="flex justify-start">
                            <button @click="isSortingOpen = !isSortingOpen" class="text-a2 lowercase">Sort by {{ isSortingOpen ? '-' : '+' }}</button>
                        </div>

                        <ul v-if="isSortingOpen" class="mt-2">
                            <li 
                                class="mb-1.5 flex items-center gap-3 before:content-[''] before:block before:w-1 before:h-1 before:rounded-full before:transition-colors"
                                :class="selectedSort === 'lowestPrice' ? 'font-medium before:bg-black' : 'font-light before:bg-transparent'"
                            >
                                <button @click="selectedSort = 'lowestPrice'" class="lowercase">Lowest Price</button>
                            </li>
                            <li 
                                class="mb-1.5 flex items-center gap-3 before:content-[''] before:block before:w-1 before:h-1 before:rounded-full before:transition-colors"
                                :class="selectedSort === 'highestPrice' ? 'font-medium before:bg-black' : 'font-light before:bg-transparent'"
                            >
                                <button @click="selectedSort = 'highestPrice'" class="lowercase">Highest Price</button>
                            </li>
                            <li 
                                class="mb-1.5 flex items-center gap-3 before:content-[''] before:block before:w-1 before:h-1 before:rounded-full before:transition-colors"
                                :class="selectedSort === 'recent' ? 'font-medium before:bg-black' : 'font-light before:bg-transparent'"
                            >
                                <button @click="selectedSort = 'recent'" class="lowercase">Recent</button>
                            </li>
                            <li 
                                class="mb-1.5 flex items-center gap-3 before:content-[''] before:block before:w-1 before:h-1 before:rounded-full before:transition-colors"
                                :class="selectedSort === 'oldest' ? 'font-medium before:bg-black' : 'font-light before:bg-transparent'"
                            >
                                <button @click="selectedSort = 'oldest'" class="lowercase">Oldest</button>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <label class="inline-flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" v-model="showInStockOnly" class="sr-only peer">
                            <span class="text-a2 lowercase">In Stock</span>
                            <div class="relative w-9 h-5 bg-black/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black/50"></div>
                        </label>
                    </div>
                </div>

                <div class="sticky bottom-0 bg-white px-4 sm:px-6 lg:px-8 xl:px-12 pt-4 pb-12">
                    <div class="flex flex-col items-center gap-4">
                        <button @click="isFilterOpen = false">
                            <CommonButton isSecondary>Show Results</CommonButton>
                        </button>

                        <button @click="selectedCategory = null; showInStockOnly = false; selectedSort = 'recent'" class="text-a2 lowercase text-grey hover:text-black transition-colors">Reset Filters</button>
                    </div>
                </div>
            </div>
        </div>

        <Transition name="fade" mode="out-in">
            <div 
                v-if="displayedItems.length > 0" 
                :key="`grid-${selectedCategory}-${showInStockOnly}-${selectedSort}`"
                class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-2.5 gap-y-8 md:gap-y-12 xl:gap-y-16"
            >
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
                                <ShopProductPrice 
                                    :productGid="object?.store?.gid" 
                                    :price="object?.store?.priceRange" 
                                    :isHidden="object?.buyOptions?.onlyInquire && object?.buyOptions?.hidePrice" 
                                    :hasVariants="object?.store?.variants?.length > 1"
                                />
                            </div>
                        </div>
                    </NuxtLink>
                </div>
            </div>
        </Transition>

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

const route = useRoute()
const router = useRouter()

const selectedCategory = ref(route.query.type || null)
const selectedSort = ref(route.query.sort || 'recent')
const showInStockOnly = ref(route.query.stock === 'true')
const itemsPerPage = 24
const currentPage = ref(1)
const isFilterOpen = ref(false)
const isTypeListOpen = ref(true)
const isSortingOpen = ref(true)

const filterText = computed(() => {
    const filters = []
    
    if (selectedCategory.value) {
        const category = categoriesWithProducts.value.find(cat => cat.slug.current === selectedCategory.value)
        if (category) {
            filters.push(category.title.toLowerCase())
        }
    }
    
    if (showInStockOnly.value) {
        filters.push('in stock')
    }
    
    return filters.length > 0 ? filters.join(', ') : '0'
})

watch(isFilterOpen, (newValue) => {
    if (process.client) {
        document.body.classList.toggle('overflow-hidden', newValue)
    }
})

const filteredProducts = computed(() => {
    let products = allProducts.value?.items || []
    
    // Apply category filter if selected
    if (selectedCategory.value) {
        products = products.filter(product => 
            product.objectsCategory?.slug?.current === selectedCategory.value
        )
    }

    // Apply stock filter if enabled
    if (showInStockOnly.value) {
        products = products.filter(product => 
            product.store?.variants?.some(variant => variant.store?.inventory?.isAvailable)
        )
    }

    // Apply sorting
    return [...products].sort((a, b) => {
        switch (selectedSort.value) {
            case 'lowestPrice':
                return (a.store?.priceRange?.minVariantPrice || Infinity) - (b.store?.priceRange?.minVariantPrice || Infinity)
            case 'highestPrice':
                return (b.store?.priceRange?.minVariantPrice || -Infinity) - (a.store?.priceRange?.minVariantPrice || -Infinity)
            case 'recent':
                return new Date(b.store?.createdAt || 0) - new Date(a.store?.createdAt || 0)
            case 'oldest':
                return new Date(a.store?.createdAt || 0) - new Date(b.store?.createdAt || 0)
            default:
                return new Date(b.store?.createdAt || 0) - new Date(a.store?.createdAt || 0)
        }
    })
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

// Watch for filter changes and update URL
watch([selectedCategory, selectedSort, showInStockOnly], ([newCategory, newSort, newInStock]) => {
    const query = {}
    
    if (newCategory) query.type = newCategory
    if (newSort !== 'recent') query.sort = newSort
    if (newInStock) query.stock = 'true'
    
    router.replace({ query })
}, { deep: true })

useSeoObject(objectsPageData?.seo, objectsPageData?.title)
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
