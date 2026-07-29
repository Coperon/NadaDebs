<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem] xl:pt-0 flex flex-col gap-20 sm:gap-24 lg:gap-30">

        <!-- Back button -->
        <CommonBackButton defaultBackRoute="/our-world/crafts" />

        <StudioProject
            :title="craftData?.title"
            :description="craftData?.description"
            :images="craftData?.images"
            :showInquire="false"
            :isCollaboration="false"
        />

        <!-- Related Products -->
        <div v-if="combinedProducts.length > 0">
            <CommonAsideHeading title="Pieces featuring this craft" />
            <ShopProductsGrid :products="combinedProducts" />
        </div>

        <!-- Related Collections -->
        <div v-if="craftData?.relatedCollections && craftData?.relatedCollections?.length > 0">
            <CommonAsideHeading title="Collections featuring this craft" />
            <ShopCollectionsGrid :collections="craftData?.relatedCollections" />
        </div>
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getCraftBySlug } from '@/data/craft'

const route = useRoute()
const craftData = await getCraftBySlug(route.params.id)

definePageMeta({
    scrollToTop: true,
})

useSeoObject(
    craftData?.value?.seo,
    craftData?.value?.title,
    craftData?.value?.images?.[0]?.image ?? craftData?.value?.thumbnail?.image,
)

const combinedProducts = computed(() => {
    const directProducts = craftData?.value?.relatedProducts || []
    const productModels = craftData?.value?.relatedProductModels || []

    const productsFromModels = productModels.flatMap(model =>
        model.products?.map(p => p.product).filter(Boolean) || [],
    )

    const allProducts = [...directProducts, ...productsFromModels]

    return allProducts.filter((product, index, self) =>
        index === self.findIndex(p => p._id === product._id),
    )
})
</script>
