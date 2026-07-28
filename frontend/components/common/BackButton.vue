<template>
    <button
        v-if="(!hideOnHardRefresh || previousRouteStore?.name) && !menuState.isOpened"
        @click="goBack"
        class="fixed z-50 left-0 top-[3.25rem] sm:top-[4.25rem] p-4 sm:p-6 lg:px-8 xl:px-12 transition-colors duration-300"
        :class="{ 'text-white': headerStore.isTopNavTransparent && route.name !== 'our-world-crafts-id' }"
    >
      <slot>
        <IconsArrow class="w-4 h-auto rotate-180" />
      </slot>
    </button>
</template>

<script setup>
const props = defineProps({
    defaultBackRoute: {
        type: String,
        default: '/',
    },
    hideOnHardRefresh: {
        type: Boolean,
        default: false,
    },
});
const previousRouteStore = usePreviousRouteStore();
const menuState = useMenuStore();
const headerStore = useHeaderStore();
const route = useRoute();
const router = useRouter();
const goBack = (event) => {
    if (previousRouteStore.name) {
      router.back();
    } else {
      router.push({ path: props.defaultBackRoute });
    }
}
</script>
