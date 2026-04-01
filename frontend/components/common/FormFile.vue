<template>
    <div>
        <label
            :for="name"
            class="w-full border border-black/20 py-4 px-6 bg-transparent flex items-center justify-between cursor-pointer hover:border-black"
        >
            <span class="truncate min-w-0 mr-4" :class="selectedFile ? 'text-a2-bold font-bold' : 'text-a2 font-light'">
                {{ selectedFile ? selectedFile.name : placeholder }}
            </span>
            <span class="text-a2 font-light shrink-0 underline underline-offset-2">Browse</span>
        </label>
        <input
            :id="name"
            ref="inputRef"
            type="file"
            :name="name"
            :accept="accept"
            class="sr-only"
            @change="onFileChange"
        />
        <p v-if="sizeError" class="mt-1 px-6 text-a2 text-red-600">{{ sizeError }}</p>
    </div>
</template>

<script setup>
const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    placeholder: {
        type: String,
        required: true,
    },
    accept: {
        type: String,
        default: '.pdf,.doc,.docx',
    },
    maxMb: {
        type: Number,
        default: 10,
    },
})

const inputRef = ref(null)
const selectedFile = ref(null)
const sizeError = ref('')
let formElement = null

function resetFile() {
    window.requestAnimationFrame(() => {
        selectedFile.value = null
        sizeError.value = ''
        if (inputRef.value) inputRef.value.value = ''
    })
}

onMounted(() => {
    formElement = inputRef.value?.form || null
    formElement?.addEventListener('reset', resetFile)
})

onBeforeUnmount(() => {
    formElement?.removeEventListener('reset', resetFile)
})

function onFileChange(e) {
    const file = e.target.files?.[0] || null
    sizeError.value = ''
    if (file && file.size > props.maxMb * 1024 * 1024) {
        sizeError.value = `File is too large. Maximum size is ${props.maxMb} MB.`
        e.target.value = ''
        selectedFile.value = null
        return
    }
    selectedFile.value = file || null
}
</script>
