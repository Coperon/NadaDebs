<template>
    <NuxtLink
        class="hover:text-blue transition-colors"
        :external="linkType == 'external'"
        :to="getLinkUrl()"
        :target="(link?.isInternalLink) ? '' : '_blank'"
        rel="noopener"
    >
        <slot />
    </NuxtLink>
</template>
<script setup>
const props = defineProps({
    link: Object,
})
const href = props?.link?.isInternalLink
    ? props?.link?.internalLink?.slug
    : props?.link?.externalUrl
const linkType = props?.link?.isInternalLink
    ? props?.link?.internalLink?._type
    : 'external'

const getLinkUrl = () => {
    // edit, add or delete link parsing logic as needed here

    switch (linkType) {
        case 'external':
            return href
        case 'homepage':
            return `/`
        case 'about':
            return `/about/`
        case 'page':
            return `/${href}/`
        case 'project':
            return `/work/${href}/`
        case 'category':
            return `/category/${href}/`
        case 'projectsArchive':
            return `/work/`
        case 'shopArchive':
            return `/shop/`
        default:
            return `/${href}/`
    }
}
</script>
