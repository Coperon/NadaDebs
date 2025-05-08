<template>
    <div v-if="blocks" class="gap-y-2 flex flex-col flex-1">
        <template v-for="(block, index) in blocks">
            <CommonTextContent v-if="block._type === 'builderTextContent'" :blocks="block?.content" />
            <CommonMedia v-if="block._type === 'builderMedia'" :media="block" width="500" mobileWidth="400" />
            <CommonGallery v-if="block._type === 'builderGallery'" :images="block?.images" :allowLightbox="block?.allowLightbox" :caption="block?.caption" />
        </template>
    </div>
</template>

<script setup>
const props = defineProps({
    blocks: {
        type: Array,
        required: true,
    },
})
</script>