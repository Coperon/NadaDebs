import { useCountryStore } from '@/stores/country'
import { getCountryCookie } from '@/composables/countryCookie'

export default defineNuxtPlugin(() => {
  const countryStore = useCountryStore()
  const { country, currencySymbol, currencyCode } = getCountryCookie()

  if (country && country !== countryStore.country) {
    countryStore.setCountry(country, currencySymbol, currencyCode)
  }
})
