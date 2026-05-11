<template>
    <div 
        class="h-11 flex items-center justify-center px-14 text-a2 uppercase bg-transparent border rounded-full transition-colors duration-300"
        :class="
            isDisabled ? 'font-light border-light-grey cursor-not-allowed pointer-events-none' : 'font-medium border-black hover:bg-black hover:text-white'
        "
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
    isDisabled: {
        type: Boolean,
        default: false,
    },
})
</script>