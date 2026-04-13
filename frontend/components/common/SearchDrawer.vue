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
                    <h2 class="text-a2 font-medium uppercase">Search products</h2>

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

                        <div v-else-if="searchQuery.length >= 3 && searchResults.length === 0" class="text-a2 text-black/40">No products found</div>

                        <div v-else-if="searchResults.length > 0" class="flex flex-col gap-8">
                            <div v-for="product in searchResults" :key="product.id" class="flex gap-4">
                                <div class="w-1/2">
                                    <NuxtLink
                                        :to="`/shop/${product.handle}`"
                                        @click="close"
                                        class="block bg-beige/30 hover:opacity-50 transition-opacity duration-300"
                                    >
                                        <img
                                            :src="product.featuredImage?.url"
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
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useSearchStore } from '@/stores/search'
import { useCountryStore } from '@/stores/country'
import { searchProducts } from '@/composables/shopify'

const searchStore = useSearchStore()
const countryStore = useCountryStore()
const route = useRoute()

const searchInput = ref(null)
const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)
let debounceTimer = null

const emit = defineEmits(['close'])

const close = () => {
    emit('close')
    searchQuery.value = ''
    searchResults.value = []
    isSearching.value = false
    clearTimeout(debounceTimer)
}

watch(searchQuery, (val) => {
    clearTimeout(debounceTimer)
    if (val.length < 3) {
        searchResults.value = []
        isSearching.value = false
        return
    }
    isSearching.value = true
    debounceTimer = setTimeout(async () => {
        searchResults.value = await searchProducts(val, countryStore.country)
        isSearching.value = false
    }, 300)
})

watch(() => searchStore.isSearchOpen, (isOpen) => {
    if (isOpen) {
        nextTick(() => searchInput.value?.focus())
    } else {
        searchQuery.value = ''
        searchResults.value = []
        isSearching.value = false
        clearTimeout(debounceTimer)
    }
})
</script>
