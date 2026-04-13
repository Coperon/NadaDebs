import { defineStore } from 'pinia'

export const useSearchStore = defineStore('search', {
  state: () => ({
    isSearchOpen: false,
  }),
  actions: {
    setSearchOpen(isOpen) {
      this.isSearchOpen = isOpen
    }
  }
})
