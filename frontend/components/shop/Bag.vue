<template>
    <ClientOnly>
        <button @click="emit('toggleCartDrawer'); menuState.isOpened = false" class="drawer-toggle lowercase text-a2 font-medium">
        Cart ({{ cartItemCount }})
    </button>
    </ClientOnly>
</template>

<script setup>
const props = defineProps({
    cartItemCount: Number,
})

const menuState = useMenuStore()

const emit = defineEmits(['toggleCartDrawer'])
</script>