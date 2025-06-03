<template>
    <div 
        class="h-11 flex items-center justify-center px-14 text-a2 uppercase border rounded-full hover:bg-white transition-colors duration-300"
        :class="isSecondary ? 'font-light bg-transparent border-black/50' : 'font-medium bg-primary-button border-primary-button'"
    >
        <slot />
    </div>
</template>

<script setup>
const props = defineProps({
    isSecondary: {
        type: Boolean,
        default: false,
    },
})
</script>