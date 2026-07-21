import { defineStore } from 'pinia'

export const useStockFilterStore = defineStore('stockFilter', () => {
  // Explicit per-category preference; absent key = use category default
  const preferences = ref({})

  const getPreference = (categoryKey, defaultValue) => {
    if (Object.prototype.hasOwnProperty.call(preferences.value, categoryKey)) {
      return preferences.value[categoryKey]
    }
    return defaultValue
  }

  const setPreference = (categoryKey, value) => {
    preferences.value[categoryKey] = value
  }

  return {
    preferences,
    getPreference,
    setPreference,
  }
})
