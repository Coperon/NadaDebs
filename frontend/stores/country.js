import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCountryStore = defineStore('country', () => {
  const country = ref('US')
  const currencySymbol = ref('$')
  const currencyCode = ref('USD')
  function setCountry(newCountry, symbol = '$', code = 'USD') {
    country.value = newCountry
    currencySymbol.value = symbol
    currencyCode.value = code
  }
  return { country, setCountry, currencySymbol, currencyCode }
})
