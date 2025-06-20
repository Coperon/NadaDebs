<template>
    <CommonContactLayout :data="contactData">
        <CommonForm formName="contact">
            <input type="hidden" name="subject" :value="subject" />
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
const subject = route.query.subject

const contactData = await getContact()

useSeoObject(contactData?.seo, contactData?.title)
</script>