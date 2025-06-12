<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem] pb-20 sm:pb-24 lg:pb-30">

        <div class="flex flex-col">
            <div class="aspect-[3/4]">
                <ShopProductGallery :featuredImage="productData?.featuredImage"
                    :secondaryImage="productData?.secondaryImage" :moreImages="productData?.moreImages" />
            </div>

            <div class="px-4 sm:px-6 lg:px-8 xl:px-12 pt-5 pb-10">
                <header>
                    <div class="text-p2 text-grey mb-1">Collection name</div>
                    <h1 class="text-a1-bold uppercase">{{ productData?.store?.title }}</h1>
                    <div class="mt-1">
                        <ShopProductPrice
                            :price="selectedVariant ? { minVariantPrice: selectedVariant.store.price, maxVariantPrice: selectedVariant.store.price } : {}"
                            :productGid="productData?.store?.gid" 
                            :isHidden="productData?.buyOptions?.hidePrice && productData?.buyOptions?.onlyInquire"
                        />
                    </div>
                </header>

                <div v-if="productData?.description" class="mt-8">
                    <div class="text-p2 whitespace-pre-line">{{ productData?.description }}</div>
                </div>

                <div class="mt-6">
                    <div v-if="productData?.store?.variants && productData?.store?.variants?.length > 1" class="border-t border-light-grey py-4">
                        <div class="text-a2 font-medium uppercase">Variants</div>
                        <div class="mt-4">
                            <ShopProductVariants 
                                :variants="productData?.store?.variants"           
                                :selectedVariant="selectedVariant"
                                :productGid="productData?.store?.gid" :variantAvailability="variantAvailability"
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
const selectedVariant = ref(null)
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
