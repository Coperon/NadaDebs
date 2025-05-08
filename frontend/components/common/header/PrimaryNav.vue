<template>
    <ul
        ref="mainNav"
        class="flex gap-x-2 items-center"
        v-show="menuIsOpened"
    >
        <li v-for="item in items" class="flex h-full items-center">
            <CommonHeaderNavLink :item="item" />
        </li>
    </ul>
</template>

<script setup>
const props = defineProps({
    menuIsOpened: Boolean,
    items: Array,
})
const mainNav = ref(null)
</script>

<style scoped>
.current-nav-item {
    @apply text-blue;
}
</style>
