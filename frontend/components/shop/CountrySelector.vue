<template>
  <div class="country-selector fixed bottom-4 right-4 z-50 bg-white border rounded shadow p-2 flex items-center gap-2 w-[300px]">
    <label for="country-select" class="text-xs font-semibold">Country:</label>
    <select id="country-select" v-model="countryStore.country" @change="onChange" class="border rounded px-2 py-1 outline-none w-full">
      <option v-for="country in countries" :key="country.isoCode" :value="country.isoCode">
        {{ country.name }} ({{ country.currency.symbol }})
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAvailableCountries, updateCartBuyerIdentity } from '@/composables/shopify'
import { useCountryStore } from '@/stores/country'

const countryStore = useCountryStore()
const cartStore = useCartStore()
const countries = ref([])

const fetchCountries = async () => {
  const localization = await getAvailableCountries(countryStore.country)
  countries.value = localization?.availableCountries || []
  if (!countries.value.find(c => c.isoCode === countryStore.country) && countries.value.length > 0) {
    const first = countries.value[0]
    countryStore.setCountry(first.isoCode, first.currency.symbol, first.currency.isoCode)
  }
}

const onChange = async () => {
  const selected = countries.value.find(c => c.isoCode === countryStore.country)
  if (selected) {
    countryStore.setCountry(selected.isoCode, selected.currency.symbol, selected.currency.isoCode)
    // Update cart buyer identity if cart exists
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
</script>