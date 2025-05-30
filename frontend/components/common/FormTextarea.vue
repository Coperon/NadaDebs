<template>
    <div>
        <textarea
            :placeholder="placeholder"
            :required="required"
            rows="12"
            class="w-full border border-black/20 text-a2-bold font-bold py-4 px-6 bg-transparent placeholder:text-a2 placeholder:font-light placeholder:text-current outline-none focus:outline-none focus:ring-0 focus:border-black"
        />
    </div>
</template>

<script setup>
const props = defineProps({
    placeholder: {
        type: String,
        required: true,
    },
    required: {
        type: Boolean,
        default: false,
    },
})
</script>