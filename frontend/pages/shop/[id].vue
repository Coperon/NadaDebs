<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem] pb-20 md:pb-24 lg:pb-30">
        <div class="flex flex-col sm:flex-row sm:items-start">
            <div class="h-[calc(100svh-3.25rem)] sm:h-[calc(100svh-4.25rem)] sm:sticky sm:top-[4.25rem] sm:w-1/2 xl:w-2/3">
                <ShopProductGallery 
                    :featuredImage="productData?.featuredImage"
                    :secondaryImage="productData?.secondaryImage" 
                    :moreImages="productData?.moreImages" 
                />
            </div>

            <div class="px-4 sm:px-6 lg:px-8 xl:px-12 pt-5 sm:pt-10 sm:w-1/2 xl:w-1/3">
                <header>
                    <div class="text-p2 text-grey mb-1">Collection name</div>
                    <h1 class="text-a1-bold uppercase">{{ productData?.store?.title }}</h1>
                    <div class="mt-1 text-p2">
                        <template v-if="productData?.buyOptions?.onlyInquire && productData?.buyOptions?.hidePrice">
                            Price upon request
                        </template>
                        <template v-else>
                            {{ formatPrice(selectedVariant?.store?.price, siteSettingsData?.currencyCode) }}
                        </template>
                    </div>
                </header>

                <div v-if="productData?.description" class="mt-8">
                    <div class="text-p2 whitespace-pre-line">{{ productData?.description }}</div>
                </div>

                <div class="mt-6">
                    <div v-if="productData?.store?.variants && productData?.store?.variants?.length > 1" class="border-t border-light-grey py-4">
                        <div class="text-a2 font-medium uppercase">
                            <template v-for="(option, index) in productData?.store?.options" :key="option._id">
                                {{ option.name }}{{ index < productData?.store?.options.length - 1 ? ' / ' : '' }}
                            </template>
                        </div>
                        <div class="mt-4">
                            <ShopProductVariants 
                                :variants="productData?.store?.variants"           
                                :selectedVariant="selectedVariant"
                                :productGid="productData?.store?.gid" 
                                :variantAvailability="variantAvailability"
                                :variantAvailabilityLoading="variantAvailabilityLoading"
                                @update:selectedVariant="selectedVariant = $event"
                            />
                        </div>
                    </div>

                    <template v-if="productData?.metaFields && productData?.metaFields?.length > 0">
                        <div v-for="metaField in productData?.metaFields" :key="metaField._key" class="border-t border-light-grey py-4">
                            <div class="text-a2 font-medium uppercase">{{ metaField.title }}</div>
                            <div class="mt-4">
                                <div class="text-p2">{{ metaField.description }}</div>
                            </div>
                        </div>
                    </template>
                </div>

                <div class="mt-6" v-if="productData">
                    <ShopAddToCart 
                        :product="productData" 
                        :selectedVariant="selectedVariant" 
                        :variantAvailability="variantAvailability" 
                        :allVariantsUnavailable="allVariantsUnavailable"
                        :variantAvailabilityLoading="variantAvailabilityLoading"
                    />
                </div>
            </div>
        </div>

        <!-- Crafts -->
         <div v-if="productData?.crafts && productData?.crafts?.length > 0" class="mt-20 sm:mt-24 lg:mt-30">
            <CommonAsideHeading title="Crafts used in this product" />
            <CraftsGrid :crafts="productData?.crafts" />
         </div>

        <!-- Making of -->
        <div v-if="productData?.makingOf && productData?.makingOf?.length > 0" class="mt-20 sm:mt-24 lg:mt-30">
            <CommonAsideHeading title="Making of" />
            <ShopProductMakingOf :images="productData?.makingOf" />
        </div>

        <!-- Related Products -->
        <div v-if="productData?.relatedProducts && productData?.relatedProducts?.length > 0" class="mt-20 sm:mt-24 lg:mt-30">
            <CommonAsideHeading title="You may also like" />
            <ShopProductsGrid :products="productData?.relatedProducts" />
        </div>
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getProductBySlug } from '@/data/product'

const route = useRoute()
const productData = await getProductBySlug(route.params.id)

const siteSettingsData = inject('siteSettingsData')
const cartStore = useCartStore()
const countryStore = useCountryStore()
const selectedVariant = ref(productData?.value?.store?.variants?.[0])
const variantAvailability = ref({})
const variantAvailabilityLoading = ref(false)

async function updateAllVariantAvailability() {
    if (!productData.value?.store?.variants) return
    variantAvailabilityLoading.value = true
    const availability = {}
    for (const variant of productData.value.store.variants) {
        if (variant?.store?.gid && productData.value?.store?.gid && countryStore.country) {
            try {
                const available = await fetchVariantAvailability(
                    variant.store.gid,
                    productData.value.store.gid,
                    countryStore.country
                )
                availability[variant.store.gid] = available === true
            } catch (e) {
                availability[variant.store.gid] =
                    variant.store?.inventory ? variant.store.inventory.isAvailable !== false : false
            }
        } else {
            availability[variant.store.gid] =
                variant.store?.inventory ? variant.store.inventory.isAvailable !== false : false
        }
    }
    variantAvailability.value = availability
    variantAvailabilityLoading.value = false
}

// Compute if all variants are unavailable for initial AddToCart state
const allVariantsUnavailable = computed(() => {
    if (variantAvailabilityLoading.value) return false // Don't show sold out while loading
    if (!productData.value?.store?.variants) return true
    return productData.value.store.variants.every(v => {
        if (v?.store?.gid && variantAvailability.value[v.store.gid] !== undefined) {
            return !variantAvailability.value[v.store.gid]
        }
        // fallback to static inventory if needed
        if (v.store?.inventory && v.store.inventory.management !== 'NOT_MANAGED' && v.store.inventory.isAvailable === false) return true
        return false
    })
})

watch(() => countryStore.country, updateAllVariantAvailability, { immediate: true })

definePageMeta({
    layout: 'default',
    scrollToTop: true,
})

useSeoObject(
    productData?.value?.seo,
    productData?.value?.title || productData?.value?.store?.title,
    productData?.value?.featuredImage,
)
</script>
