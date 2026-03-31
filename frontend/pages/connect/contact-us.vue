<template>
    <CommonContactLayout :data="contactData">
        <div v-if="inquiry" class="text-p2 py-4 px-6 mb-3 bg-light-grey flex justify-between gap-6">
            <p>
                You are inquiring about <a :href="inquiryLink" class="font-medium hover:underline">{{ inquiry }}</a>.
            </p>
            <p>
                <a href="/connect/contact-us" class="text-a2 hover:underline">Remove</a>
            </p>
        </div>

        <CommonForm formName="contact" formType="contact" endpoint="/api/send">
            <input type="hidden" name="inquiry-subject" :value="inquiry" />
            <input type="hidden" name="inquiry-title" :value="inquiryTitle" />
            <input type="hidden" name="inquiry-image" :value="inquiryImage" />
            <input type="hidden" name="inquiry-link" :value="inquiryLink" />
            <input type="hidden" name="inquiry-product-id" :value="inquiryProductId" />
            <CommonFormInput type="text" name="first-name" placeholder="First Name *" required />
            <CommonFormInput type="text" name="last-name" placeholder="Last Name *" required />
            <CommonFormInput type="tel" name="mobile-number" placeholder="Mobile Number *" required />
            <CommonFormInput type="email" name="email-address" placeholder="Email Address *" required />
            <CommonFormSelect name="country" placeholder="Country *" :options="COUNTRIES" required />
            <CommonFormSelect name="profession" placeholder="Profession *" :options="PROFESSIONS" required />
            <CommonFormTextarea name="message" placeholder="Message *" required />
        </CommonForm>
    </CommonContactLayout>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getContact } from '@/data/contact'
import { COUNTRIES } from '@/utils/countries'
import { PROFESSIONS } from '@/utils/professions'

const route = useRoute()
const inquiry = String(route.query.inquiry || '')
const inquiryTitle = String(route.query.inquiryTitle || inquiry || '')
const inquiryImage = String(route.query.inquiryImage || '')
const inquiryLink = String(route.query.inquiryLink || '')
const inquiryProductId = String(route.query.inquiryProductId || '')

const contactData = await getContact()

useSeoObject(contactData?.seo, contactData?.title)
</script>