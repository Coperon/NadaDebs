<template>
    <article
        class="content flex flex-col flex-1 gap-y-2  p-4 whitespace-pre-line"
    >
        <header v-if="title">
            <h1 class="text-lg font-bold">{{ title }}</h1>
        </header>
        <!-- example of per block iteration -->
        <!-- <slot
        v-for="(block, index) in content">
        <SanityContent
            :key="index"
            :blocks="[block]"
            :serializers="portableTextSerializers"
        />
        </slot> -->
        <PortableText :value="indexedContent" :components="myPortableTextSerializers" />
    </article>
</template>

<script setup>
import { PortableText } from '@portabletext/vue'
import Mark from '@/components/common/content/Mark.vue'
import Link from '@/components/common/content/Link.vue'
import Media from '@/components/common/content/Media.vue'
import Gallery from '@/components/common/content/Gallery.vue'
import Blockquote from '@/components/common/content/Blockquote.vue'
// import CustomStyle from '@/components/common/content/CustomStyle.vue'

const props = defineProps({
    blocks: Object,
    title: {
        type: String,
        required: false,
    },
})

const indexedContent = computed(() => {
    // Transform the content array as needed here.
    // This is just an example, you'll need to adjust this to your needs.
    if (!props.blocks) return []
    return props.blocks.map((block, index) => {
        return {
            ...block,
            index: index,
        }
    })
})
const myPortableTextSerializers = {
    // example of custom style serializer
    // styles: {
    //     customStyle: (props, { slots }) => {
    //         return h(CustomStyle, {}, slots.default)
    //     },
    // },
    types: {
        media: props => {
            // Use ArticleBlocksMedia component
            return h(Media, { media: props })
        },
        gallery: props => {
            // Use Gallery component
            return h(Gallery, {
                images: props?.images || [],
                caption: props?.caption,
                allowLightbox: props?.allowLightbox,
            })
        },
        // add any other type/custom block here
    },
    marks: {
        // marks are inline decorators like strong, em, code, etc
        highlight: (value, { slots }) => {
            return h(Mark, slots.default)
        },
        blockquote: (value, { slots }) => {
            return h(Blockquote, slots.default)
        },
        link: (link, { slots }) => {
            return h(Link, { link: link?.value }, slots.default)
        },
    },
}
</script>
<style scoped>
.content :deep(h1),
.content :deep(h2),
.content :deep(h3) {
    @apply text-lg;
}

.content :deep(h1) {
    @apply uppercase;
}
</style>
