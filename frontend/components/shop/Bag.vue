<template>
    <ClientOnly>
    <button @click="emit('toggleCartDrawer')" class="drawer-toggle ml-4 uppercase">
        Cart ({{ cartItemCount }})
    </button>
    </ClientOnly>
</template>

<script setup>
const props = defineProps({
    cartItemCount: Number,
})

const emit = defineEmits(['toggleCartDrawer'])
</script>