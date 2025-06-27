<template>
    <section>
        <AboutText :title="aboutNada?.title" :text="aboutNada?.text" />
        <AboutMap v-if="markers && markers.length > 0" :markers="markers" />
        <AboutHandmadeHeartmade v-if="handmadeHeartmade" :content="handmadeHeartmade" />
    </section>
</template>

<script setup>
const props = defineProps({
    aboutNada: {
        type: Object,
        required: true
    },
    markers: {
        type: Array,
        required: false
    },
    handmadeHeartmade: {
        type: Object,
        required: false
    }
})
</script>