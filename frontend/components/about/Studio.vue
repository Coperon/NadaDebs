<template>
    <section>
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