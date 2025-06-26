<template>
    <header class="py-20 sm:py-24 lg:py-30 lg:min-h-[28.75rem] px-4 flex flex-col items-center justify-center text-center gap-6">
        <h1 class="text-h1-mobile sm:text-h1 uppercase">{{ title }}</h1>
        <div class="max-w-[62ch] mx-auto whitespace-pre-line">
            {{ description }}
        </div>
        <div v-if="button" class="flex justify-center">
            <NuxtLink :to="button.link">
                <CommonButton>{{ button.text }}</CommonButton>
            </NuxtLink>
        </div>
    </header>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    button: {
        type: Object,
        required: false,
    },
})
</script>