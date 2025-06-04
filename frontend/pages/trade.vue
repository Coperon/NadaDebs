<template>
    <CommonContactLayout :data="tradeData">
        <CommonForm formName="trade">
            <CommonFormInput type="text" name="company-name" placeholder="Company Name *" required />
            <CommonFormInput type="url" name="company-website" placeholder="Company Website *" required />
            <CommonFormInput type="text" name="type-of-business" placeholder="Type of Business *" required />
            <CommonFormInput type="text" name="first-name" placeholder="First Name *" required />
            <CommonFormInput type="text" name="last-name" placeholder="Last Name *" required />
            <CommonFormInput type="tel" name="mobile-number" placeholder="Mobile Number *" required />
            <CommonFormInput type="email" name="email-address" placeholder="Email Address *" required />
            <CommonFormInput type="text" name="country" placeholder="Country *" required />
            <CommonFormTextarea name="message" placeholder="Message *" required />
        </CommonForm>

        <form name="trade" data-netlify="true" hidden>
            <input type="text" name="company-name" />
            <input type="url" name="company-website" />
            <input type="text" name="type-of-business" />
            <input type="text" name="first-name" />
            <input type="text" name="last-name" />
            <input type="tel" name="mobile-number" />
            <input type="email" name="email-address" />
            <input type="text" name="country" />
            <textarea name="message"></textarea>
            <input type="checkbox" name="terms" />
        </form>
    </CommonContactLayout>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getTrade } from '@/data/trade'

const tradeData = await getTrade()

useSeoObject(tradeData?.seo, tradeData?.title)
</script>