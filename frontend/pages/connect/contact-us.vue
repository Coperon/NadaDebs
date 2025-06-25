<template>
    <CommonContactLayout :data="contactData">
        <div v-if="inquiry" class="text-p2 py-4 px-6 mb-3 bg-light-grey">
            <p>
                You are inquiring about <span class="font-medium">{{ inquiry }}</span>.
            </p>
        </div>

        <CommonForm formName="contact">
            <input type="hidden" name="inquiry-subject" :value="inquiry" />
            <CommonFormInput type="text" name="first-name" placeholder="First Name *" required />
            <CommonFormInput type="text" name="last-name" placeholder="Last Name *" required />
            <CommonFormInput type="tel" name="mobile-number" placeholder="Mobile Number *" required />
            <CommonFormInput type="email" name="email-address" placeholder="Email Address *" required />
            <CommonFormInput type="text" name="country" placeholder="Country *" required />
            <CommonFormInput type="text" name="profession" placeholder="Profession *" required />
            <CommonFormTextarea name="message" placeholder="Message *" required />
        </CommonForm>
    </CommonContactLayout>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getContact } from '@/data/contact'

const route = useRoute()
const inquiry = route.query.inquiry

const contactData = await getContact()

useSeoObject(contactData?.seo, contactData?.title)
</script>