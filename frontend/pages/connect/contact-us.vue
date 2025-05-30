<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem] pb-20 sm:pb-24 lg:pb-30">
        <CommonPageHeader 
            :title="contactData?.title" 
            :description="contactData?.description" 
        />

        <div class="flex flex-col gap-20 md:flex-row md:items-start md:gap-0">
            <div v-if="contactData?.image" class="aspect-square sm:aspect-auto relative overflow-hidden sm:h-svh md:sticky md:top-0 md:w-1/2">
                <CommonMediaImage
                    :image="contactData.image"
                    :alt="contactData.image.alt"
                    width="768"
                    mobileWidth="768"
                    class="absolute inset-0 w-full h-full object-cover"
                />
            </div>

            <div class="px-4 sm:px-6 lg:px-8 xl:px-12 max-w-screen-sm mx-auto md:w-1/2">
                <form name="contact" method="POST" data-netlify="true">
                    <div class="grid grid-cols-1 gap-3">
                        <CommonFormInput type="text" name="first-name" placeholder="First Name *" required />
                        <CommonFormInput type="text" name="last-name" placeholder="Last Name *" required />
                        <CommonFormInput type="tel" name="mobile-number" placeholder="Mobile Number *" required />
                        <CommonFormInput type="email" name="email-address" placeholder="Email Address *" required />
                        <CommonFormInput type="text" name="country" placeholder="Country *" required />
                        <CommonFormInput type="text" name="profession" placeholder="Profession *" required />
                        <CommonFormTextarea name="message" placeholder="Message *" required />
                    </div>
                    <div class="mt-6 flex items-center gap-2">
                        <input type="checkbox" id="terms" class="appearance-none border border-black/20 rounded-none bg-transparent w-3.5 h-3.5 shrink-0 relative checked:after:content-[''] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:w-1.5 checked:after:h-1.5 checked:after:bg-black checked:after:rounded-full checked:after:translate-x-[-50%] checked:after:translate-y-[-50%]" required />
                        <label for="terms" class="text-a2">I have read and agreed to Nada Debs <NuxtLink :to="`/info/${siteSettingsData?.termsAndConditions?.slug?.current}`" target="_blank" class="underline underline-offset-2">Terms & Conditions</NuxtLink> and <NuxtLink :to="`/info/${siteSettingsData?.privacyPolicy?.slug?.current}`" target="_blank" class="underline underline-offset-2">Privacy Policy</NuxtLink></label>
                    </div>

                    <div class="mt-10 flex justify-center">
                        <button type="submit" class="h-11 px-14 text-a2 font-medium uppercase bg-primary-button rounded-full hover:bg-white transition-colors duration-300">Send</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getContact } from '@/data/contact'

const contactData = await getContact()
const siteSettingsData = inject('siteSettingsData')

useSeoObject(contactData?.seo, contactData?.title)
</script>