import { defineStore } from 'pinia'

export const useCurrentProductStore = defineStore('currentProduct', () => {
  const currentProduct = ref(null)

  const setCurrentProduct = (product) => {
    currentProduct.value = product
  }

  const clearCurrentProduct = () => {
    currentProduct.value = null
  }

  return {
    currentProduct,
    setCurrentProduct,
    clearCurrentProduct
  }
}) 