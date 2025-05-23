<template>
    <section>
        <AboutText :title="aboutStudio?.title" :text="aboutStudio?.text" />

        <div v-if="aboutStudio?.images" class="mt-20 sm:mt-24 lg:mt-30">
            <CommonSlider :images="aboutStudio?.images" />
        </div>
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