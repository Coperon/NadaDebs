// store.js
import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', {
    state: () => ({ isOpened: false }),
})
