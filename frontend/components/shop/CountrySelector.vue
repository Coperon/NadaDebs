<template>
    <div class="relative">
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
            class="lowercase text-a2 font-medium bg-transparent cursor-pointer"
        >
            <option v-for="country in countries" :key="country.isoCode" :value="country.isoCode">
                {{ country.name }} ({{ country.currency.symbol }})
            </option>
        </select>
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
    return selected ? `${selected.name} (${selected.currency.symbol})` : ''
})

const updateSelectWidth = () => {
    if (measureSpan.value) {
        const textWidth = measureSpan.value.offsetWidth
        selectWidth.value = textWidth + 20
    }
}

const fetchCountries = async () => {
    const localization = await getAvailableCountries(countryStore.country)
    countries.value = localization?.availableCountries || []
    if (!countries.value.find(c => c.isoCode === countryStore.country) && countries.value.length > 0) {
        const first = countries.value[0]
        countryStore.setCountry(first.isoCode, first.currency.symbol, first.currency.isoCode)
    }
    nextTick(() => {
        updateSelectWidth()
    })
}

const onChange = async () => {
    const selected = countries.value.find(c => c.isoCode === countryStore.country)
    if (selected) {
        countryStore.setCountry(selected.isoCode, selected.currency.symbol, selected.currency.isoCode)
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