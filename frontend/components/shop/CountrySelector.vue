<template>
    <div class="relative inline-flex items-center">
        <span 
            ref="measureSpan" 
            class="lowercase text-a2 font-medium absolute invisible whitespace-nowrap"
        >
            {{ selectedCountryText }}
        </span>
        
        <select 
            ref="selectElement"
            id="country-select" 
            v-model="countryStore.country" 
            @change="onChange"
            :style="{ width: selectWidth + 'px' }"
            class="lowercase text-a2 font-medium bg-transparent cursor-pointer appearance-none p-0 pr-2.5 outline-none focus:outline-none focus:ring-0"
        >
            <option v-for="country in countries" :key="country.isoCode" :value="country.isoCode">
                {{ country.name }}
            </option>
        </select>
        <svg
            width="8"
            height="5"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
        >
            <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </div>
</template>

<script setup>
import { getAvailableCountries, updateCartBuyerIdentity } from '@/composables/shopify'
import { useCountryStore } from '@/stores/country'

const countryStore = useCountryStore()
const cartStore = useCartStore()
const countries = ref([])
const selectElement = ref(null)
const measureSpan = ref(null)
const selectWidth = ref(100)

const selectedCountryText = computed(() => {
    const selected = countries.value.find(c => c.isoCode === countryStore.country)
    return selected ? selected.name : ''
})

const updateSelectWidth = () => {
    if (measureSpan.value) {
        const textWidth = measureSpan.value.offsetWidth
        selectWidth.value = textWidth + 14
    }
}

const fetchCountries = async () => {
    const localization = await getAvailableCountries(countryStore.country)
    const available = localization?.availableCountries || []
    const collator = new Intl.Collator(undefined, { usage: 'sort', sensitivity: 'base' })
    countries.value = [...available].sort((a, b) => collator.compare(a?.name || '', b?.name || ''))

    // Keep display currency as AED symbol from Shopify (not the selected country's currency)
    const aedCountry = countries.value.find(c => c.isoCode === 'AE')
    if (aedCountry?.currency?.symbol) {
        countryStore.setCurrencySymbol(aedCountry.currency.symbol)
    }

    if (!countries.value.find(c => c.isoCode === countryStore.country) && countries.value.length > 0) {
        countryStore.setCountry(countries.value[0].isoCode)
    }
    nextTick(() => {
        updateSelectWidth()
    })
}

const onChange = async () => {
    const selected = countries.value.find(c => c.isoCode === countryStore.country)
    if (selected) {
        countryStore.setCountry(selected.isoCode)
        nextTick(() => {
            updateSelectWidth()
        })
        if (cartStore.cart && cartStore.cart.id) {
            const updatedCart = await updateCartBuyerIdentity(cartStore.cart.id, selected.isoCode)
            if (updatedCart) {
                cartStore.setCart(updatedCart)
            }
        }
    }
}

onMounted(() => {
    fetchCountries()
})

watch(selectedCountryText, () => {
    nextTick(() => {
        updateSelectWidth()
    })
})
</script>
