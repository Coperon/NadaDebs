<template>
    <div class="newsletter max-w-xs">
        <h2 class="text-a2 font-medium uppercase">Stay up to date with our Newsletter</h2>

        <form
            name="newsletter-subscribes"
            method="POST"
            action="/"
            class="mc-form mt-5"
            @submit="submitForm"    
        >
            <div class="flex gap-3 items-center border-b border-black/20">
                <input
                    ref="emailInput"
                    class="flex-1 py-2 border-none bg-[transparent] appearance-none outline-none focus:outline-none focus:ring-0 lowercase placeholder:text-a2-light placeholder:text-black/30"
                    type="email"
                    placeholder="Your email here"
                    name="mc-email"
                    required
                />

                <button
                    ref="submitButton"
                    type="submit"
                >
                    <IconsArrow class="w-3 h-auto" />
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
