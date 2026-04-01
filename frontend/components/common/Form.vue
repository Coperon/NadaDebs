<template>
    <form :name="formName" method="POST" data-netlify="true" @submit="onSubmit">
        <input type="hidden" name="form-name" :value="formName" />
        <div class="grid grid-cols-1 gap-3">
            <slot />
        </div>
        <div class="mt-6 flex items-center gap-2">
            <input type="checkbox" name="terms" id="terms" class="appearance-none border border-black/20 rounded-none bg-transparent w-3.5 h-3.5 shrink-0 relative checked:after:content-[''] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:w-1.5 checked:after:h-1.5 checked:after:bg-black checked:after:rounded-full checked:after:translate-x-[-50%] checked:after:translate-y-[-50%]" required />
            <label for="terms" class="text-a2">I have read and agreed to Nada Debs <NuxtLink :to="`/info/${siteSettingsData?.termsAndConditions?.slug?.current}`" target="_blank" class="underline underline-offset-2">Terms & Conditions</NuxtLink> and <NuxtLink :to="`/info/${siteSettingsData?.privacyPolicy?.slug?.current}`" target="_blank" class="underline underline-offset-2">Privacy Policy</NuxtLink></label>
        </div>

        <div class="mt-10 flex justify-center">
            <button type="submit" class="appearance-none">
                <CommonButton>{{ isSubmitting ? 'Sending…' : 'Send' }}</CommonButton>
            </button>
        </div>

        <p v-if="submitState === 'success'" class="mt-4 text-center text-a2">
            Thanks — we received your message.
        </p>
        <p v-else-if="submitState === 'error'" class="mt-4 text-center text-a2 text-red-600">
            {{ submitError || 'Something went wrong sending your message. Please try again.' }}
        </p>
    </form>
</template>

<script setup>
const props = defineProps({
    formName: {
        type: String,
        required: true
    },
    endpoint: {
        type: String,
        default: null
    },
    formType: {
        type: String,
        default: null
    }
})

const siteSettingsData = inject('siteSettingsData')

function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result.split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

const isSubmitting = ref(false)
const submitState = ref('idle') // 'idle' | 'success' | 'error'
const submitError = ref('')

async function onSubmit(e) {
    if (!props.endpoint) return

    e.preventDefault()
    if (isSubmitting.value) return

    isSubmitting.value = true
    submitState.value = 'idle'
    submitError.value = ''

    try {
        const form = e.target
        const formData = new FormData(form)
        const payload = {}
        for (const [key, value] of formData.entries()) {
            if (value instanceof File) {
                if (value.size > 0) {
                    payload[key] = await readFileAsBase64(value)
                    payload[`${key}-filename`] = value.name
                    payload[`${key}-type`] = value.type || 'application/octet-stream'
                }
            } else {
                payload[key] = value
            }
        }
        payload.formType = props.formType || props.formName

        await $fetch(props.endpoint, {
            method: 'POST',
            body: payload
        })

        submitState.value = 'success'
        form.reset()
    } catch (err) {
        submitState.value = 'error'
        submitError.value = err?.data?.message || err?.message || ''
    } finally {
        isSubmitting.value = false
    }
}
</script>