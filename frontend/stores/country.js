import { getCountryCookie, setCountryCookie } from '@/composables/countryCookie'

export const useCountryStore = defineStore('country', () => {
  const { country, currencySymbol, currencyCode } = getCountryCookie()

  const countryRef = ref(country)
  const currencySymbolRef = ref(currencySymbol)
  const currencyCodeRef = ref(currencyCode)

  function setCountry(newCountry, symbol = '$', code = 'USD') {
    countryRef.value = newCountry
    currencySymbolRef.value = symbol
    currencyCodeRef.value = code
    setCountryCookie(newCountry, symbol, code)
  }
  return { country: countryRef, setCountry, currencySymbol: currencySymbolRef, currencyCode: currencyCodeRef }
})
