<template>
    <button
        v-if="!hideOnHardRefresh || hideOnHardRefresh && previousRouteStore?.name"
        @click="goBack"
    >
      <slot>Back</slot>
    </button>
</template>

<script setup>
const props = defineProps({
    defaultBackRoute: {
        type: String,
        default: '/work',
    },
    hideOnHardRefresh: {
        type: Boolean,
        default: false,
    },
});
const previousRouteStore = usePreviousRouteStore();

const router = useRouter();
const goBack = (event) => {
    if (previousRouteStore.name) {
      router.back();
    } else {
      router.push({ path: props.defaultBackRoute });
    }
}
</script>
