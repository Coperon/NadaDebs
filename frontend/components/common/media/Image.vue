<template>
    <picture>
        <source
            media="(min-width: 1537px)"
            :srcset="largeSrcset"
        />
        <source
            media="(min-width: 769px) and (max-width: 1536px)"
            :srcset="mediumSrcset"
        />
        <source
            media="(max-width: 768px)"
            :srcset="mobileSrcset"
        />
        <img
            :class="$attrs.class"
            :src="mediumSize"
            :alt="$attrs.alt || image?.asset?.altText || filenameWithoutExtension"
            :width="realWidth"
            :height="realHeight"
            :loading="$attrs.loading || (useLazy ? 'lazy' : 'eager')"
        />
    </picture>
</template>

<script setup>
import imageUrlBuilder  from '@sanity/image-url'

const config = useRuntimeConfig()
const builder = imageUrlBuilder({
    projectId: config.public.sanity.projectId,
    dataset: config.public.sanity.dataset,
    apiVersion: config.public.sanity.apiVersion,
})

const props = defineProps({
    image: {
        type: Object,
        required: true,
    },
    width: {
        type: String,
        required: true,
    },
    height: {
        type: String,
        required: false,
    },
    mobileWidth: {
        type: String,
        required: true,
    },
    mobileHeight: {
        type: String,
        required: false,
    },
    useLazy: {
        type: Boolean,
        default: true,
    },
    quality: {
        type: String,
        required: false,
        default: '85'
    },
    format: {
        type: String,
        required: false,
        default: 'auto'
    },
})

const desktopImageLimitpx = 4000
const mobileImageLimitpx = 2000

const lgSizes = {
    width: props.width,
    height: props.height,
}

const mbSizes = {
    width: props.mobileWidth || props.width,
    height: props.mobileHeight,
}


// Get original image dimensions
const originalWidth = props.image?.asset?.metadata?.dimensions?.width
const originalHeight = props.image?.asset?.metadata?.dimensions?.height
const realWidth = ref(originalWidth)
const realHeight = ref(originalHeight)

const getImageUrl = (image, width, height) => {

    width = Math.round(width)
    height = height ? Math.round(height) : null
    let imageBuilder 
    if (props?.format != 'auto') {
        imageBuilder = builder.image(image).width(width).format(props.format).quality(props.quality).auto('format').fit('max')
    } else {
        imageBuilder = builder.image(image).width(width).quality(props.quality).auto('format').fit('max')
    }
    if (height) imageBuilder = imageBuilder.height(height)

    return imageBuilder.url();
}


const largeSize = computed(() => {
    let width = lgSizes.width > desktopImageLimitpx ? desktopImageLimitpx : lgSizes.width
    let height = lgSizes.height ? lgSizes.height > desktopImageLimitpx ? desktopImageLimitpx : lgSizes.height : null
    return getImageUrl(props.image, width, height)
})

const mediumSize = computed(() => {
    let width = lgSizes.width * .75 > desktopImageLimitpx ? desktopImageLimitpx : lgSizes.width * .75
    let height = lgSizes.height ? lgSizes.height * .75 > desktopImageLimitpx ? desktopImageLimitpx : lgSizes.height * .75 : null
    return getImageUrl(props.image, width, height)
})

const mediumSize2x = computed(() => {
    let width = lgSizes.width * 1.5 > desktopImageLimitpx ? desktopImageLimitpx : lgSizes.width * 1.5
    let height = lgSizes.height ? lgSizes.height * 1.5 > desktopImageLimitpx ? desktopImageLimitpx : lgSizes.height * 1.5 : null
    return getImageUrl(props.image, width, height)
})

const largeSize2x = computed(() => {
    let width = lgSizes.width * 2 > desktopImageLimitpx ? desktopImageLimitpx : lgSizes.width * 2
    let height = lgSizes.height ? lgSizes.height * 2 > desktopImageLimitpx ? desktopImageLimitpx : lgSizes.height * 2 : null
    return getImageUrl(props.image, width, height)
})

const mobileSize = computed(() => {
    let width = mbSizes.width > mobileImageLimitpx ? mobileImageLimitpx : mbSizes.width
    let height = mbSizes.height ? mbSizes.height > mobileImageLimitpx ? mobileImageLimitpx : mbSizes.height : null
    return getImageUrl(props.image, width, height)
})

const mobileSize2x = computed(() => {
    let width = mbSizes.width * 2 > mobileImageLimitpx ? mobileImageLimitpx : mbSizes.width * 2
    let height = mbSizes.height ? mbSizes.height * 2 > mobileImageLimitpx ? mobileImageLimitpx : mbSizes.height * 2 : null
    return getImageUrl(props.image, width, height)
})

// Get Srcsets
const largeSrcset = computed(() => {
    return `${largeSize.value} 1x, ${largeSize2x.value} 2x`
})

const mediumSrcset = computed(() => {
    return `${mediumSize.value} 1x, ${mediumSize2x.value} 2x`
})

const mobileSrcset = computed(() => {
    return props.mobileWidth ? `${mobileSize.value} 1x, ${mobileSize2x.value} 2x` : `${largeSize.value} 1x, ${largeSize2x.value} 2x`
})

// Get filename without extension
const filenameWithoutExtension = computed(() => {
    return props.image?.asset?.originalFilename ? props.image?.asset?.originalFilename.split('.').slice(0, -1).join('.') : ''
})

onBeforeMount(() => {
    // add matchmedia to open or close menu both on load or on change
    const mq = window.matchMedia('(min-width: 768px)')

    mq.addEventListener('change', e => {
        if (e.matches) {
            realWidth.value = originalWidth
            realHeight.value = originalHeight
        } else {
            realWidth.value = props.mobileWidth
            realHeight.value = originalHeight * (props.mobileWidth / originalWidth)
        }
    })
})
</script>