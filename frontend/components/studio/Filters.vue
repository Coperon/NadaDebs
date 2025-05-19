<template>
    <ul>
        <li>
            <button @click="selectCategory(null)">All</button>
        </li>
        <li v-for="category in categories" :key="category._id">
            <button @click="selectCategory(category._id)">{{ category.title }}</button>
        </li>
    </ul>
</template>

<script setup>
const props = defineProps({
    categories: {
        type: Array,
        required: true
    },
})

</script>