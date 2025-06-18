<template>
    <div 
        class="h-11 flex items-center justify-center px-14 text-a2 uppercase border rounded-full transition-colors duration-300"
        :class="{
            'font-medium bg-primary-button border-primary-button hover:bg-black hover:text-white hover:border-black' : !isSecondary && !isDisabled,
            'font-light bg-transparent border border-black hover:bg-black hover:text-white hover:border-black' : isSecondary && !isDisabled,
            'font-light bg-transparent border border-light-grey cursor-not-allowed pointer-events-none' : isDisabled,
        }"
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