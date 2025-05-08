<template>
    <CommonLink 
        :link="item?.link"
        active-class="text-blue"
        class="nav-link hover:underline transition-colors"
    >
       {{ item?.text }}
    </CommonLink>
</template>
<script setup>
const props = defineProps({
    item: Object,
})
</script>
