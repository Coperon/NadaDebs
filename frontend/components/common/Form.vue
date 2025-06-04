<template>
    <form :name="formName" method="POST" data-netlify="true">
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
                <CommonButton>Send</CommonButton>
            </button>
        </div>
    </form>
</template>

<script setup>
const props = defineProps({
    formName: {
        type: String,
        required: true
    }
})

const siteSettingsData = inject('siteSettingsData')
</script>