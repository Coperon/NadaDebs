<template>
    <header class="py-16 sm:py-20 2xl:py-24 px-4 flex flex-col items-center justify-center text-center gap-5">
        <h1 class="text-a1-bold uppercase">{{ title }}</h1>
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