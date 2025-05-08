export default defineNuxtRouteMiddleware((to, from) => {
    // custom conditional transition middleware example:
    // const transitionStore = useTransitionStore();
    // if (!transitionStore.isEnabled) {
    //   to.meta.pageTransition = {
    //     name:'teleport',
    //     mode: 'out-in',
    //   };
    //   from.meta.pageTransition = {
    //     name:'teleport',
    //     mode: 'out-in',
    //   };
    // } else {
    //   // add a fade transition to all other pages
    //   to.meta.pageTransition = { name: 'page', mode: 'in-out'};
    //   from.meta.pageTransition = { name: 'page', mode: 'in-out'};
    // }
})
