<template>
    <header class="py-20 sm:py-25 lg:py-30 px-4 flex flex-col items-center text-center gap-6">
        <h1 class="text-h1-mobile sm:text-h1 uppercase">{{ title }}</h1>
        <div class="max-w-[62ch] mx-auto">
            {{ description }}
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
})
</script>