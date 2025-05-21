<template>
    <section class="py-20 sm:py-24 lg:py-30">
        <AboutText :title="aboutStudio?.title" :text="aboutStudio?.text" />
    </section>
</template>

<script setup>
const props = defineProps({
    aboutStudio: {
        type: Object,
        required: false
    },
})
</script>