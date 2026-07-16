<template>
    <div class="pb-20 sm:pb-24 lg:pb-30">
        <CommonHero :cover="collectionData?.cover" :subtitle="'Craft Stories'" :title="collectionData?.title" />

        <div v-if="collectionData?.tags" class="my-6 px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-wrap gap-x-6 gap-y-3 md:gap-x-8 md:gap-y-4 xl:gap-x-12 xl:gap-y-6">
            <div v-for="tag in collectionData?.tags" :key="tag" class="text-a2 uppercase text-grey whitespace-nowrap">{{ tag }}</div>
        </div>

        <CommonPageHeader :title="'About the Collection'" :description="collectionData?.aboutTheCollection" />

        <div class="flex flex-col gap-20 sm:gap-24 lg:gap-30">
            <div v-if="collectionData?.lifestyleImages && collectionData?.lifestyleImages.length > 0" class="flex flex-col gap-6 sm:flex-row sm:gap-x-3.5 sm:gap-y-6">
                <div v-for="image in collectionData?.lifestyleImages" :key="image._key" class="sm:w-1/3">
                    <div class="relative overflow-hidden aspect-[4/5]">
                        <CommonMediaImage
                            :image="image?.asset"
                            :alt="image?.caption"
                            width="1024"
                            mobileWidth="1024"
                            class="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                    <CommonGridCaption v-if="image?.caption">
                        <div class="text-p2 text-grey">{{ image?.caption }}</div>
                    </CommonGridCaption>
                </div>
            </div>

            <div v-if="collectionData?.featuredText" class="px-4 sm:px-6 lg:px-8 xl:px-12">
                <CommonQuote :text="collectionData?.featuredText" />
            </div>

            <CommonContentGrid v-if="collectionData?.imagesGrid" :content="collectionData?.imagesGrid" />

            <div v-if="collectionData?.crafts && collectionData?.crafts?.length > 0">
                <CommonAsideHeading title="Crafts used in this collection" />
                <CraftsGrid :crafts="collectionData?.crafts" />
            </div>

            <div v-if="collectionData?.relatedProducts && collectionData?.relatedProducts?.length > 0">
                <CommonAsideHeading title="Shop the Collection" />
                <ShopProductsGrid :products="collectionData?.relatedProducts" />
            </div>

            <div class="flex justify-center">
                <NuxtLink to="/shop/collections">
                    <CommonButton isSecondary>
                        <div class="flex items-center gap-1.5">
                            <IconsArrow class="w-3 h-auto -scale-x-100" />
                            <span>Back to Collections</span>
                        </div>
                    </CommonButton>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getCollectionBySlug } from '@/data/collection'

const route = useRoute()
const collectionData = await getCollectionBySlug(route.params.id)

definePageMeta({
    scrollToTop: true,
})

useSeoObject(
    collectionData?.value?.seo,
    collectionData?.value?.title,
    collectionData?.value?.cover || collectionData?.value?.thumbnail,
)
</script>