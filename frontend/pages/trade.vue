<template>
    <CommonContactLayout :data="tradeData">
        <CommonForm formName="trade" formType="trade" endpoint="/api/send">
            <CommonFormInput type="text" name="company-name" placeholder="Company Name *" required />
            <CommonFormInput type="url" name="company-website" placeholder="Company Website *" required />
            <CommonFormInput type="text" name="type-of-business" placeholder="Type of Business *" required />
            <CommonFormInput type="text" name="first-name" placeholder="First Name *" required />
            <CommonFormInput type="text" name="last-name" placeholder="Last Name *" required />
            <CommonFormInput type="tel" name="mobile-number" placeholder="Mobile Number *" required />
            <CommonFormInput type="email" name="email-address" placeholder="Email Address *" required />
            <CommonFormSelect name="country" placeholder="Country *" :options="COUNTRIES" required />
            <CommonFormTextarea name="message" placeholder="Message *" required />
        </CommonForm>
    </CommonContactLayout>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getTrade } from '@/data/trade'
import { COUNTRIES } from '@/utils/countries'

const tradeData = await getTrade()

useSeoObject(tradeData?.seo, tradeData?.title)
</script>