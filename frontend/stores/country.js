import {
  getCountryCookie,
  setCountryCookie,
  DISPLAY_CURRENCY_CODE,
  DISPLAY_CURRENCY_SYMBOL,
} from '@/composables/countryCookie'

export const useCountryStore = defineStore('country', () => {
  const { country, currencySymbol } = getCountryCookie()

  const countryRef = ref(country)
  const currencySymbolRef = ref(currencySymbol)
  const currencyCodeRef = ref(DISPLAY_CURRENCY_CODE)

  function setCountry(newCountry, symbol = currencySymbolRef.value || DISPLAY_CURRENCY_SYMBOL) {
    countryRef.value = newCountry
    currencySymbolRef.value = symbol
    currencyCodeRef.value = DISPLAY_CURRENCY_CODE
    setCountryCookie(newCountry, symbol)
  }

  function setCurrencySymbol(symbol) {
    currencySymbolRef.value = symbol
    setCountryCookie(countryRef.value, symbol)
  }

  return {
    country: countryRef,
    setCountry,
    setCurrencySymbol,
    currencySymbol: currencySymbolRef,
    currencyCode: currencyCodeRef,
  }
})
