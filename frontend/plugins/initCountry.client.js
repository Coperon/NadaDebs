import { useCountryStore } from '@/stores/country'
import { getCountryCookie } from '@/composables/countryCookie'

export default defineNuxtPlugin(() => {
  const countryStore = useCountryStore()
  const { country, currencySymbol } = getCountryCookie()

  // Sync country from cookie; keep AED currency symbol (clears legacy $)
  if (country) {
    countryStore.setCountry(country, currencySymbol)
  }
})
