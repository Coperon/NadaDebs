<template>
    <div class="newsletter">
        <form
            name="newsletter-subscribes"
            method="POST"
            action="/"
            class="flex mc-form mt-2"
            @submit="submitForm"    
        >
            <label class="mr-2">Newsletter</label>
            <div class="flex gap-x-2 items-baseline">
                <label class="sr-only lg:col-span-5">Email:</label>
                <input
                    ref="emailInput"
                    class="border-b bg-[transparent] appearance-none outline-none focus:outline-none focus:ring-0"
                    type="email"
                    placeholder=""
                    name="mc-email"
                    required
                />

                <button
                    ref="submitButton"
                    type="submit"
                    class="flex normal-case hover:underline"
                >
                    ok
                </button>
            </div>
        </form>
        <div ref="resultStatusMessage" class="mt-2 text-blue"></div>
    </div>
</template>
<script setup>
const SUBSCRIBE_API = '/.netlify/functions/subscribe?email='
const emailInput = ref(null)
const submitButton = ref(null)
const resultStatusMessage = ref(null)

const submitForm = (e) => {
    e.preventDefault()
    const email = emailInput.value.value
    if (!email) return
    submitButton.value.disabled = true
    resultStatusMessage.value.innerHTML = 'Subscribing you...'
    fetch(SUBSCRIBE_API + email)
        .then(res => {
            return res.json()
        })
        .then(res => {
            console.log('status', res.status)
            if (res.status === 'subscribed') {
                resultStatusMessage.value.innerHTML = 'Thanks, you have been subscribed!'
            } else if (res.status === 400) {
                resultStatusMessage.value.innerHTML = `Sorry, there was an error: ${res.detail}`
            }
            submitButton.value.disabled = false
        })
        .catch(e => {
            console.log('error result', e)
        })
}
</script>
