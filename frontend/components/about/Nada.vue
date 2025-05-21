<template>
    <section class="py-20 sm:py-24 lg:py-30">
        <AboutText :title="aboutNada?.title" :text="aboutNada?.text" />
        <AboutHandmadeHeartmade :content="handmadeHeartmade" />
    </section>
</template>

<script setup>
const props = defineProps({
    aboutNada: {
        type: Object,
        required: false
    },
    handmadeHeartmade: {
        type: Object,
        required: false
    }
})
</script>