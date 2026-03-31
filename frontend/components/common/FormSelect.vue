<template>
    <div class="relative">
        <select
            ref="selectElement"
            :name="name"
            :required="required"
            v-model="selected"
            class="w-full border border-black/20 py-4 pl-6 pr-10 bg-transparent outline-none focus:outline-none focus:ring-0 focus:border-black appearance-none cursor-pointer"
            :class="selected ? 'text-a2-bold font-bold' : 'text-a2 font-light'"
        >
            <option value="" disabled>{{ placeholder }}</option>
            <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
        </select>
        <span class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </span>
    </div>
</template>

<script setup>
defineProps({
    name: {
        type: String,
        required: true,
    },
    placeholder: {
        type: String,
        required: true,
    },
    options: {
        type: Array,
        required: true,
    },
    required: {
        type: Boolean,
        default: false,
    },
})

const selectElement = ref(null)
let formElement = null
const selected = ref('')

function resetSelected() {
    window.requestAnimationFrame(() => {
        selected.value = ''
    })
}

onMounted(() => {
    formElement = selectElement.value?.form || null
    formElement?.addEventListener('reset', resetSelected)
})

onBeforeUnmount(() => {
    formElement?.removeEventListener('reset', resetSelected)
})
</script>
