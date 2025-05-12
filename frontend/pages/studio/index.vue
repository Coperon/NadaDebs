<template>
    <div>
        <CommonLanding
            :imageDefault="studioData?.cover?.image"
            :videoDefaultUrl="studioData?.cover?.video"
            :imageLeft="studioData?.collaborations?.image"
            :videoLeftUrl="studioData?.collaborations?.video"
            :imageCenter="studioData?.interiors?.image"
            :videoCenterUrl="studioData?.interiors?.video"
            :imageRight="studioData?.bespoke?.image"
            :videoRightUrl="studioData?.bespoke?.video"
            :leftLabel="'Collaborations'"
            :centerLabel="'Interiors'"
            :rightLabel="'Bespoke'"
            :leftUrl="'/studio/collaborations'"
            :centerUrl="'/studio/interiors'"
            :rightUrl="'/studio/bespoke'"
        />
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getStudioData } from '@/data/studio'

const studioData = await getStudioData()

useSeoObject(studioData?.value?.seo, studioData?.value?.title)
</script>