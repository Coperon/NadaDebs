<template>
    <div
        class="fixed z-10 inset-0 text-black transition-opacity duration-300"
        :class="{ 'opacity-0 pointer-events-none': !searchStore.isSearchOpen }"
    >
        <div
            class="absolute inset-0"
            :class="route.path.startsWith('/shop/') ? 'bg-beige/20' : 'bg-transparent'"
            @click="close"
        ></div>

        <div class="bg-white absolute h-svh right-0 w-full sm:max-w-[24rem] overflow-y-auto">
            <div class="h-[3.25rem] sm:h-[4.25rem] flex items-center justify-end px-4 sm:px-6 sticky top-0 z-10 bg-white">
                <button @click="close">
                    <div class="w-6 h-6">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </div>
                </button>
            </div>

            <div class="px-4 sm:px-6 pb-12">
                <div class="max-w-xs">
                    <h2 class="text-a2 font-medium uppercase">Search</h2>

                    <div class="mt-5 flex items-center border-b border-black/20">
                        <input
                            ref="searchInput"
                            v-model="searchQuery"
                            class="flex-1 py-2 border-none bg-[transparent] appearance-none outline-none focus:outline-none focus:ring-0 lowercase placeholder:text-a2-light placeholder:text-black/30"
                            type="text"
                            placeholder="Type something..."
                            autocomplete="off"
                        />
                    </div>

                    <div class="mt-6">
                        <div v-if="isSearching" class="text-a2 text-black/40">Searching...</div>

                        <div v-else-if="hasNoResults" class="text-a2 text-black/40">No results found</div>

                        <div v-else class="flex flex-col gap-10">
                            <div v-if="productResults.length > 0" class="flex flex-col gap-8">
                                <h3 class="text-a2 font-medium uppercase">Products</h3>

                                <div v-for="product in productResults" :key="product.id" class="flex gap-4">
                                    <div class="w-1/2">
                                        <NuxtLink
                                            :to="`/shop/${product.handle}`"
                                            @click="close"
                                            class="block hover:opacity-50 transition-opacity duration-300"
                                            :style="productImageBackgroundStyle"
                                        >
                                            <CommonMediaImage
                                                v-if="product.sanityFeaturedImage?.asset"
                                                :image="product.sanityFeaturedImage"
                                                :alt="product.title"
                                                width="384"
                                                mobileWidth="384"
                                                class="w-full h-auto"
                                            />
                                            <img
                                                v-else-if="product.previewImageUrl"
                                                :src="product.previewImageUrl"
                                                :alt="product.title"
                                                class="w-full h-auto"
                                            />
                                        </NuxtLink>
                                    </div>
                                    <div class="w-1/2">
                                        <h3 class="text-h2">{{ product.title }}</h3>
                                        <div class="mt-3">{{ formatPrice(product.priceRange.minVariantPrice.amount) }}</div>
                                    </div>
                                </div>
                            </div>

                            <div v-for="section in sanitySections" :key="section.label" class="flex flex-col gap-8">
                                <h3 class="text-a2 font-medium uppercase">{{ section.label }}</h3>

                                <div v-for="item in section.items" :key="item._id" class="flex gap-4">
                                    <div class="w-1/2">
                                        <NuxtLink
                                            :to="item.url"
                                            @click="close"
                                            class="block bg-beige/30 hover:opacity-50 transition-opacity duration-300"
                                        >
                                            <CommonMediaImage
                                                :image="item.image"
                                                :alt="item.title"
                                                width="384"
                                                mobileWidth="384"
                                                class="w-full h-auto"
                                            />
                                        </NuxtLink>
                                    </div>
                                    <div class="w-1/2">
                                        <h3 class="text-h2">{{ item.title }}</h3>
                                        <p class="mt-3 text-a2 text-black/60 line-clamp-3">{{ item.excerpt }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useSearchStore } from '@/stores/search'
import { searchProducts } from '@/composables/shopify'
import { PRICE_COUNTRY_CODE } from '@/composables/countryCookie'
import { searchSanityContent, getProductImagesByHandles } from '@/data/search'
import { getShopPageData } from '@/data/shopPage'

const searchStore = useSearchStore()
const route = useRoute()
const shopData = await getShopPageData()

const productImageBackgroundStyle = computed(() => ({
    backgroundColor: shopData.value?.productImageBackgroundColor || 'rgba(241, 234, 228, 0.3)',
}))

const searchInput = ref(null)
const searchQuery = ref('')
const productResults = ref([])
const sanityResults = ref([])
const isSearching = ref(false)
let debounceTimer = null
let requestToken = 0

const SANITY_SECTIONS = [
    { type: 'craft', label: 'Crafts' },
    { type: 'collaboration', label: 'Collaborations' },
    { type: 'interior', label: 'Interiors' },
    { type: 'post', label: 'News' },
    { type: 'collection', label: 'Collections' },
]

const sanitySections = computed(() =>
    SANITY_SECTIONS
        .map(({ type, label }) => ({ label, items: sanityResults.value.filter((item) => item._type === type) }))
        .filter((section) => section.items.length > 0)
)

const hasNoResults = computed(() =>
    searchQuery.value.length >= 3 && productResults.value.length === 0 && sanityResults.value.length === 0
)

const emit = defineEmits(['close'])

const enrichProductsWithSanityImages = async (products) => {
    const handles = products.map((product) => product.handle).filter(Boolean)
    const imagesByHandle = await getProductImagesByHandles(handles)

    return products.map((product) => {
        const sanityImages = imagesByHandle[product.handle]
        return {
            ...product,
            sanityFeaturedImage: sanityImages?.featuredImage || null,
            previewImageUrl: sanityImages?.previewImageUrl || null,
        }
    })
}

const resetResults = () => {
    productResults.value = []
    sanityResults.value = []
    isSearching.value = false
    clearTimeout(debounceTimer)
}

const close = () => {
    emit('close')
    searchQuery.value = ''
    resetResults()
}

watch(searchQuery, (val) => {
    clearTimeout(debounceTimer)
    if (val.length < 3) {
        resetResults()
        return
    }
    isSearching.value = true
    debounceTimer = setTimeout(async () => {
        const token = ++requestToken
        const [products, sanityContent] = await Promise.all([
            searchProducts(val, PRICE_COUNTRY_CODE),
            searchSanityContent(val),
        ])
        if (token !== requestToken) return

        const enrichedProducts = await enrichProductsWithSanityImages(products)
        if (token !== requestToken) return

        productResults.value = enrichedProducts
        sanityResults.value = sanityContent
        isSearching.value = false
    }, 300)
})

watch(() => searchStore.isSearchOpen, (isOpen) => {
    if (isOpen) {
        nextTick(() => searchInput.value?.focus())
    } else {
        searchQuery.value = ''
        resetResults()
    }
})
</script>
