<template>
    <div class="content flex flex-col gap-y-2">
        <PortableText :value="blocks" :components="myPortableTextSerializers" />
    </div>
</template>

<script setup>
import { PortableText } from '@portabletext/vue'
import Link from '@/components/common/content/Link.vue'
/* To allow line breaks you can pass whitespace-pre-line class. Example: <CommonTextContent :blocks class="whitespace-pre-line" /> */

const props = defineProps({
    blocks: Object,
})

const myPortableTextSerializers = {
    marks: {
        link: (link, { slots }) => {
            return h(Link, { link: link?.value }, slots.default)
        },
    },
}
</script>
<style scoped>
/* Example of how to style elements in the portable text content */
/* .content :deep(h1),
.content :deep(h2),
.content :deep(h3) {
    @apply text-lg;
}

.content :deep(h1) {
    @apply uppercase;
} */
</style>
