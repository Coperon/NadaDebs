<template>
    <figcaption class="italic text-right relative pt-2 px-2">
        <CommonTextContent :blocks="caption" />
    </figcaption>
</template>
<script setup>

const props = defineProps({
    caption: {
        type: Array,
    },
    xSpacing: {
        type: Boolean,
        default: false,
    },
})
</script>
