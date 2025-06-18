<template>
    <div :class="{ 'pt-[3.25rem] sm:pt-[4.25rem]': !cover }">
        <div v-if="cover" class="h-svh relative overflow-hidden">
            <CommonMediaImage
                :image="cover"
                :alt="title"
                width="1536"
                mobileWidth="768"
                class="absolute inset-0 w-full h-full object-cover"
            />

            <div class="absolute inset-0 flex items-center justify-center text-center p-4 sm:p-6 lg:p-8 xl:p-12 bg-black/30 text-white">
                <div class="flex flex-col gap-3 sm:gap-4 lg:gap-6">
                    <div v-if="subtitle" class="text-a2 uppercase">{{ subtitle }}</div>
                    <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.05em] uppercase">{{ title }}</h1>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    cover: {
        type: Object,
        required: true,
    },
    subtitle: {
        type: String,
        required: false,
    },
    title: {
        type: String,
        required: true,
    },
})
</script>