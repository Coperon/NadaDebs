import type { RouterConfig } from "@nuxt/schema";

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp()
    if(savedPosition)
    {
      if(to.path == from.path)
      return savedPosition
      else
      return new Promise((resolve, reject) => {
        nuxtApp.hooks.hookOnce('page:transition:finish', () => {
          requestAnimationFrame(() => resolve(savedPosition))
        })
      })
    }
    else{
      if (to.hash && to.path == from.path) {
        return { el: to.hash }
      }
      else if(to.hash && to.path != from.path) {
        return new Promise((resolve, reject) => {
          nuxtApp.hooks.hookOnce('page:transition:finish', () => {
            requestAnimationFrame(() => resolve({ el: to.hash }))
          })
        })
      }
      else{
        if(to)
        {
          return new Promise((resolve, reject) => {
            nuxtApp.hooks.hookOnce('page:transition:finish', () => {
              requestAnimationFrame(() => resolve({ top:0, left:0 }))
            })
          })
        }
        else
        {
          return { top: 0, left: 0 }
        }
      }
    }
  }
};
