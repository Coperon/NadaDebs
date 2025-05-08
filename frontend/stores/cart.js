import { defineStore } from 'pinia'
import { initShopify } from '@/composables/shopify'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: null,
    isCartOpen: false,
  }),
  actions: {
    setCart(cart) {
      this.cart = cart
    },
    setCartOpen(isOpen) {
      this.isCartOpen = isOpen
    }
  }
})
