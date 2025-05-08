<template>
    <div :class="'flex flex-col'">
        <CommonMedia :media="media" width="700" mobileWidth="350" />
    </div>
</template>

<script setup>
const props = defineProps({
    media: {
        type: Object,
        required: true,
    },
})
</script>
