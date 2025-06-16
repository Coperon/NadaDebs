<template>
    <div class="px-4 sm:px-6 lg:px-8 xl:px-12 mb-10">
        <h2 class="text-a2-bold uppercase text-center">{{ title }}</h2>
    </div>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        required: true,
    },
})
</script>