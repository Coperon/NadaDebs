<template>
    <div>
        <input 
            :type="type"
            :placeholder="placeholder"
            :required="required"
            class="w-full border border-black/20 text-a2-bold font-bold py-4 px-6 bg-transparent placeholder:text-a2 placeholder:font-light placeholder:text-current outline-none focus:outline-none focus:ring-0 focus:border-black"
        />
    </div>
</template>

<script setup>
const props = defineProps({
    type: {
        type: String,
        required: true,
    },
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