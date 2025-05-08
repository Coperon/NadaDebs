import { defineStore } from 'pinia';

export const usePreviousRouteStore =  defineStore('previousRouteStore', {
    state: () => ({
        name: '',
    }),
});
