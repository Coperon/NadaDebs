<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem] pb-20 sm:pb-24 lg:pb-30">
        <CommonPageHeader 
            :title="pageData?.title" 
            :description="pageData?.description" 
        />

        <!-- Filters -->
        <div class="px-4 sm:px-6 lg:px-8 xl:px-12 flex justify-between items-center gap-6 mb-4 md:mb-6 xl:mb-8">
            <div>
                <label class="inline-flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" v-model="showInStockOnly" class="sr-only peer">
                    <div class="relative w-9 h-5 bg-black/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black/50"></div>
                    <span class="text-a2 font-medium lowercase">In Stock</span>
                </label>
            </div>
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
                                class="mb-1.5 break-inside-avoid"
                            >
                                <template v-if="type.subTypes?.length">
                                    <div 
                                        v-if="type.subTypes?.length"
                                        class="pl-4"
                                    >
                                        <button
                                            @click="toggleCategory(type._id)"
                                            class="lowercase text-left"
                                            :class="{
                                                'font-medium': isMounted && (selectedCategory === type.slug.current || isAnySubcategorySelected(type))
                                            }"
                                        >
                                            {{ type.title }}
                                            <ClientOnly>
                                                {{ expandedCategories.includes(type._id) ? '-' : '+' }}
                                            </ClientOnly>
                                        </button>
                                    </div>

                                    <ClientOnly>
                                        <ul v-if="expandedCategories.includes(type._id)" class="mt-1.5 ml-4 break-inside-avoid">
                                            <li 
                                                v-for="sub in type.subTypes" 
                                                :key="sub._id"
                                                class="mb-1.5 flex items-center gap-3 before:content-[''] before:block before:w-1 before:h-1 before:rounded-full before:transition-colors"
                                                :class="selectedCategory === sub.slug.current ? 'font-medium before:bg-black' : 'font-light before:bg-transparent'"
                                            >
                                                <button @click="selectedCategory = selectedCategory === sub.slug.current ? null : sub.slug.current" class="lowercase text-left">
                                                    {{ sub.title }}
                                                </button>
                                            </li>
                                            <li 
                                                class="flex items-center gap-3 before:content-[''] before:block before:w-1 before:h-1 before:rounded-full before:transition-colors"
                                                :class="selectedCategory === type.slug.current ? 'font-medium before:bg-black' : 'font-light before:bg-transparent'"
                                            >
                                                <button @click="selectedCategory = selectedCategory === type.slug.current ? null : type.slug.current" class="lowercase">All</button>
                                            </li>
                                        </ul>
                                    </ClientOnly>
                                </template>
                                <template v-else>
                                    <div
                                        class="flex items-center gap-3 before:content-[''] before:block before:w-1 before:h-1 before:rounded-full before:transition-colors"
                                        :class="selectedCategory === type.slug.current ? 'font-medium before:bg-black' : 'font-light before:bg-transparent'"
                                    >
                                        <button 
                                            @click="selectedCategory = selectedCategory === type.slug.current ? null : type.slug.current"
                                            class="lowercase"
                                        >{{ type.title }}</button>
                                    </div>
                                </template>
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
                                :class="selectedSort === 'custom' ? 'font-medium before:bg-black' : 'font-light before:bg-transparent'"
                            >
                                <button @click="selectedSort = 'custom'" class="lowercase">Custom</button>
                            </li>
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
                </div>

                <div class="sticky bottom-0 bg-white px-4 sm:px-6 lg:px-8 xl:px-12 pt-4 pb-12">
                    <div class="flex flex-col items-center gap-4">
                        <button @click="isFilterOpen = false">
                            <CommonButton isSecondary>Show Results</CommonButton>
                        </button>

                        <button @click="selectedCategory = null; selectedSort = 'custom'" class="text-a2 lowercase text-grey hover:text-black transition-colors">Reset Filters</button>
                    </div>
                </div>
            </div>
        </div>

        <Transition name="fade" mode="out-in">
            <div
                v-if="displayedItems.length > 0"
                :key="`grid-${selectedCategory}-${showInStockOnly}-${selectedSort}`"
            >
                <ShopProductsGrid :products="displayedItems" />
            </div>
            <div
                v-else-if="showInStockOnly && productAvailability === null"
                key="loading"
                class="px-4 sm:px-6 lg:px-8 xl:px-12 py-16 text-center text-a2 text-grey lowercase"
            >
                loading...
            </div>
            <div
                v-else
                key="empty"
                class="px-4 sm:px-6 lg:px-8 xl:px-12 py-16 text-center text-a2 text-grey lowercase"
            >
                no products currently in stock
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

        <aside class="mt-20 sm:mt-24 lg:mt-30 lg:relative">
            <div class="text-p2 lowercase text-center lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:w-1/3">Continue Exploring</div>
            <div class="mt-6 flex flex-col gap-6 sm:flex-row lg:justify-between">
                <NuxtLink 
                    :to="route.name === 'shop-objects' ? '/shop/furniture' : '/shop/objects'" 
                    class="group aspect-[4/5] relative overflow-hidden flex items-center justify-center sm:w-1/2 lg:w-1/3"
                    :class="isMounted && isTouchDevice() ? 'text-white' : 'text-black hover:text-white transition-colors duration-300'"
                >
                    <CommonMediaImage
                        :image="route.name === 'shop-objects' ? shopData?.furniture?.image : shopData?.objects?.image"
                        :alt="route.name === 'shop-objects' ? 'Furniture' : 'Objects'"
                        width="1536"
                        mobileWidth="768"
                        class="absolute inset-0 w-full h-full object-cover"
                        :class="isMounted && isTouchDevice() ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 transition-opacity duration-300'"
                    />
                    <div class="text-h1-mobile sm:text-h1 uppercase relative">
                        {{ route.name === 'shop-objects' ? 'Furniture' : 'Objects' }}
                    </div>
                </NuxtLink>
                <NuxtLink 
                    to="/shop/collections" 
                    class="group aspect-[4/5] relative overflow-hidden flex items-center justify-center sm:w-1/2 lg:w-1/3"
                    :class="isMounted && isTouchDevice() ? 'text-white' : 'text-black hover:text-white transition-colors duration-300'"
                >
                    <CommonMediaImage
                        :image="shopData?.collections?.image"
                        alt="Collections"
                        width="1536"
                        mobileWidth="768"
                        class="absolute inset-0 w-full h-full object-cover"
                        :class="isMounted && isTouchDevice() ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 transition-opacity duration-300'"
                    />
                    <div class="text-h1-mobile sm:text-h1 uppercase relative">
                        Collections
                    </div>
                </NuxtLink>
            </div>
        </aside>
    </div>
</template>

<script setup>
import { isTouchDevice } from '@/utils'
import { getShopPageData } from '@/data/shopPage'
import { fetchProductsAvailability } from '@/composables/shopify'
const shopData = await getShopPageData()

const props = defineProps({
    pageData: {
        type: Object,
        required: true,
    },
    categories: {
        type: Array,
        required: true,
    },
    allProducts: {
        type: Object,
        required: true,
    },
    categoryKey: {
        type: String,
        required: true,
    },
})

const route = useRoute()
const router = useRouter()
const countryStore = useCountryStore()
const productAvailability = ref(null) // null = not yet fetched; { [gid]: boolean } once loaded

const selectedCategory = ref(route.query.type || null)
const selectedSort = ref(route.query.sort || 'custom')
const showInStockOnly = ref(route.query.stock === 'true')
const itemsPerPage = 48
const currentPage = ref(1)
const isFilterOpen = ref(false)
const isTypeListOpen = ref(true)
const isSortingOpen = ref(true)
const isMounted = ref(false)
const expandedCategories = ref([])

const filterText = computed(() => {
    if (!selectedCategory.value) return '0'

    const selectedCategoryData = categoriesWithProducts.value.find(cat => 
        cat.slug.current === selectedCategory.value
    )

    if (selectedCategoryData) {
        return selectedCategoryData.title.toLowerCase()
    }

    for (const mainCategory of categoriesWithProducts.value) {
        if (mainCategory.subTypes) {
            const subCategory = mainCategory.subTypes.find(sub => 
                sub.slug.current === selectedCategory.value
            )
            if (subCategory) {
                return `${mainCategory.title.toLowerCase()}, ${subCategory.title.toLowerCase()}`
            }
        }
    }

    return '0'
})

watch(isFilterOpen, (newValue) => {
    if (process.client) {
        document.body.classList.toggle('overflow-hidden', newValue)
    }
})

const filteredProducts = computed(() => {
    let products = props.allProducts?.items || []
    
    // Apply category filter if selected
    if (selectedCategory.value) {
        products = products.filter(product => {
            const mainCategoryMatch = product[`${props.categoryKey}Category`]?.slug?.current === selectedCategory.value
            const subCategoryMatch = product[`${props.categoryKey}Subtype`]?.slug?.current === selectedCategory.value
            
            return mainCategoryMatch || subCategoryMatch
        })
    }

    // Apply stock filter if enabled
    if (showInStockOnly.value) {
        products = products.filter(product => {
            const gid = product.store?.gid
            if (productAvailability.value !== null && gid) {
                return productAvailability.value[gid] === true
            }
            // Fall back to static Sanity data while availability hasn't loaded yet
            return product.store?.variants?.some(variant => variant.store?.inventory?.isAvailable)
        })
    }

    // Apply sorting
    return [...products].sort((a, b) => {
        switch (selectedSort.value) {
            case 'custom':
                return 0
            case 'lowestPrice':
                return (a.store?.priceRange?.minVariantPrice || Infinity) - (b.store?.priceRange?.minVariantPrice || Infinity)
            case 'highestPrice':
                return (b.store?.priceRange?.minVariantPrice || -Infinity) - (a.store?.priceRange?.minVariantPrice || -Infinity)
            case 'recent':
                return new Date(b.store?.createdAt || 0) - new Date(a.store?.createdAt || 0)
            case 'oldest':
                return new Date(a.store?.createdAt || 0) - new Date(b.store?.createdAt || 0)
            default:
                return 0
        }
    })
})

const categoriesWithProducts = computed(() => {
    if (!props.categories || !props.allProducts?.items) return []
    
    return props.categories.filter(category => {
        const hasMainCategoryProducts = props.allProducts.items.some(product => 
            product[`${props.categoryKey}Category`]?.slug?.current === category.slug.current
        )
        const hasSubCategoryProducts = props.allProducts.items.some(product => 
            product[`${props.categoryKey}Subtype`]?.slug?.current === category.slug.current
        )

        return hasMainCategoryProducts || hasSubCategoryProducts
    })
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

const toggleCategory = (categoryId) => {
    const index = expandedCategories.value.indexOf(categoryId)
    if (index > -1) {
        expandedCategories.value.splice(index, 1)
    } else {
        expandedCategories.value.push(categoryId)
    }
}

const isAnySubcategorySelected = (category) => {
    if (!isMounted.value) return false
    if (!category?.subTypes?.length) return false
    if (!selectedCategory.value) return false
    return category.subTypes.some(sub => selectedCategory.value === sub.slug.current)
}

watch(selectedCategory, () => {
    currentPage.value = 1
})

// Watch for filter changes and update URL
watch([selectedCategory, selectedSort, showInStockOnly], ([newCategory, newSort, newInStock]) => {
    const query = {}
    
    if (newCategory) query.type = newCategory
    if (newSort !== 'custom') query.sort = newSort
    if (newInStock) query.stock = 'true'
    
    router.replace({ query })
}, { deep: true })

const refreshProductAvailability = async () => {
    const gids = (props.allProducts?.items || []).map(p => p.store?.gid).filter(Boolean)
    if (!gids.length || !countryStore.country) return
    productAvailability.value = await fetchProductsAvailability(gids, countryStore.country)
}

watch(() => countryStore.country, refreshProductAvailability)

onMounted(() => {
    isMounted.value = true
    refreshProductAvailability()
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
