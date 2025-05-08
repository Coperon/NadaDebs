<template>
    <footer
        id="footer"
        class="grid grid-cols-12 p-2 border-t gap-y-2 lg:gap-y-0 lg:gap-x-1 bg-white"
    >
        <ul class="col-span-12 lg:col-span-4 flex gap-x-1 lg:flex-col gap-y-1 lg:gap-y-0 justify-between lg:justify-start">
            <li v-if="contact?.email">
                <a :href="'mailto:' + contact.email" class="hover:underline block py-1 lg:py-0">{{
                    contact.email
                }}</a>
            </li>
            <li v-if="contact?.address" class="py-1 lg:py-0 text-right lg:text-left">
                <div class="not-italic whitespace-pre-line" v-html="contact.address" />
            </li>
        </ul>
        <ul
            class="col-span-6 lg:col-span-2 flex flex-col gap-y-1 lg:gap-y-0"
        >
            <li v-for="item in legalLinks">
                <a :href="`/${item?.slug?.current}/`" class="hover:underline block py-1 lg:py-0">{{
                    item?.title
                }}</a>
            </li>
        </ul>
        <ul
            class="col-span-6 lg:col-span-2 lg:ml-auto flex flex-col gap-x-4 lg:gap-x-0 gap-y-1 lg:gap-y-0 items-end lg:items-start"
        >
            <li v-for="item in socialLinks">
                <a target="_blank" :href="item?.url" class="hover:underline block py-1 lg:py-0">{{
                    item?.title
                }}</a>
            </li>
        </ul>
        <div class="col-span-12 lg:col-span-4 flex-col flex mt-4 lg:mt-0">
            <CommonFooterMailchimpSubscription class="lg:text-right w-fit lg:ml-auto" />
            <div class="lg:ml-auto lg:text-right lg:whitespace-pre-line mt-1">
                <CommonTextContent :blocks="credits" />
            </div>
        </div>
    </footer>
</template>

<script setup>
const props = defineProps({
    contact: Object,
    socialLinks: Object,
    legalLinks: Array,
    credits: Array,
})
</script>
