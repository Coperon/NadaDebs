<template>
    <section>
        <AboutText :title="aboutNada?.title" :text="aboutNada?.text" />
        <AboutHandmadeHeartmade v-if="handmadeHeartmade" :content="handmadeHeartmade" />
    </section>
</template>

<script setup>
const props = defineProps({
    aboutNada: {
        type: Object,
        required: true
    },
    handmadeHeartmade: {
        type: Object,
        required: false
    }
})
</script>