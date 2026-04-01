<template>
    <CommonContactLayout :data="applyData">
        <div v-if="position" class="text-p2 py-4 px-6 mb-3 bg-light-grey flex justify-between gap-6">
            <p>
                You are applying for the position of <a :href="positionLink" class="font-medium hover:underline">{{ position }}</a>.
            </p>
            <p>
                <a href="/work-with-us/apply" class="text-a2 hover:underline">Remove</a>
            </p>
        </div>

        <CommonForm formName="apply" formType="apply" endpoint="/api/send">
            <input type="hidden" name="position" :value="position" />
            <input type="hidden" name="position-link" :value="positionLink" />
            <CommonFormInput type="text" name="first-name" placeholder="First Name *" required />
            <CommonFormInput type="text" name="last-name" placeholder="Last Name *" required />
            <CommonFormInput type="tel" name="mobile-number" placeholder="Mobile Number *" required />
            <CommonFormInput type="email" name="email-address" placeholder="Email Address *" required />
            <CommonFormSelect name="country" placeholder="Country *" :options="COUNTRIES" required />
            <CommonFormInput type="url" name="cv-url" placeholder="CV / Portfolio URL" />
            <CommonFormFile name="cv-file" placeholder="CV / Portfolio Document (PDF, DOC, DOCX)" accept=".pdf,.doc,.docx" />
            <CommonFormTextarea name="motivation" placeholder="Motivation *" required />
        </CommonForm>
    </CommonContactLayout>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getApply } from '@/data/apply'
import { COUNTRIES } from '@/utils/countries'

const route = useRoute()
const position = String(route.query.position || '')
const positionLink = String(route.query.positionLink || '')

const applyData = await getApply()

useSeoObject(applyData?.seo, applyData?.title)
</script>