<template>
    <CommonLink :link="link" class="underline">
        <slot />
    </CommonLink>
</template>
<script setup>
const props = defineProps({
    link: Object
})
</script>
