<template>
    <ClientOnly>
        <button @click="emit('toggleCartDrawer')" class="drawer-toggle lowercase text-a2 font-medium">
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