<template>
    <div>
        <CommonLanding
            :imageDefault="shopData?.cover?.image"
            :videoDefaultUrl="shopData?.cover?.video"
            :imageLeft="shopData?.objects?.image"
            :videoLeftUrl="shopData?.objects?.video"
            :imageCenter="shopData?.furniture?.image"
            :videoCenterUrl="shopData?.furniture?.video"
            :imageRight="shopData?.collections?.image"
            :videoRightUrl="shopData?.collections?.video"
            :leftLabel="'Objects'"
            :centerLabel="'Furniture'"
            :rightLabel="'Collections'"
            :leftUrl="'/shop/objects'"
            :centerUrl="'/shop/furniture'"
            :rightUrl="'/shop/collections'"
        />
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getShopPageData } from '@/data/shopPage'

const shopData = await getShopPageData()

useSeoObject(shopData?.value?.seo, shopData?.value?.title)
</script>