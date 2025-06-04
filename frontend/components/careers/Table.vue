<template>
    <div>
        <div class="hidden md:flex gap-4 text-a2 lowercase mb-4 px-4 md:px-6 lg:px-8 xl:px-12">
            <span class="w-1/6">City</span>
            <span class="w-1/3 lg:w-1/2">Position</span>
            <span class="w-1/6">Open Until</span>
            <span class="w-1/3 lg:w-1/6"></span>
        </div>

        <div v-for="position in positions" :key="position._key" class="border-t border-black/50">
            <NuxtLink
              v-if="!isSingle"
              :to="`/work-with-us/${position?.slug?.current}`"
              class="block px-4 sm:px-6 lg:px-8 xl:px-12 py-4 xl:py-5 hover:bg-primary-button transition-colors duration-300"
            >
                <CareersRow :position="position" />
            </NuxtLink>
            <div
              v-else
              class="block px-4 sm:px-6 lg:px-8 xl:px-12 py-4 xl:py-5"
            >
                <CareersRow :position="position" isSingle />
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    positions: {
        type: Array,
        required: true
    },
    isSingle: {
        type: Boolean,
        default: false
    }
})
</script>