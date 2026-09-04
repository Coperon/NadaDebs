<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem] pb-20 md:pb-24 lg:pb-30">
        <!-- Back button -->
        <CommonBackButton :defaultBackRoute="defaultBackRoute" />

        <!-- Product content -->
        <div class="flex flex-col sm:flex-row sm:items-start">
            <div class="h-[calc(100svh-3.25rem)] sm:h-[calc(100svh-4.25rem)] sm:sticky sm:top-[4.25rem] sm:w-1/2 xl:w-2/3">
                <ShopProductGallery 
                    v-if="hasGalleryImages"
                    :previewImage="activePreviewImage"
                    :featuredImage="activeFeaturedImage"
                    :secondaryImage="activeSecondaryImage" 
                    :moreImages="activeMoreImages" 
                    :modelImages="productData?.productModel?.images"
                    :title="productData?.store?.title"
                />
            </div>

            <div class="px-4 sm:px-6 lg:px-8 xl:px-12 pt-5 sm:pt-10 sm:w-1/2 xl:w-1/3">
                <header>
                    <div v-if="productData?.collection" class="mb-1">
                        <NuxtLink 
                            v-if="productData?.collection" 
                            :to="`/shop/collections/${productData.collection.slug.current}`"
                            class="text-p2 text-grey hover:text-black transition-colors"
                        >{{ productData.collection.title }}</NuxtLink>
                    </div>
                    <h1 class="text-a1-bold uppercase">{{ productData?.store?.title }}</h1>
                    <div class="mt-1 text-p2">
                        <template v-if="productData?.buyOptions?.onlyInquire && productData?.buyOptions?.hidePrice">
                            Price upon request
                        </template>
                        <template v-else>
                            <ShopProductPrice 
                                :productGid="productData?.store?.gid" 
                                :selectedVariant="selectedVariant" 
                            />
                        </template>
                    </div>
                </header>

                <div v-if="productData?.description || productData?.productModel?.description" class="mt-8">
                    <div class="text-p2 whitespace-pre-line">{{ productData?.description || productData?.productModel?.description }}</div>
                </div>

                <div class="mt-6">
                    <div v-if="productData?.productModel?.products && productData?.productModel?.products?.length > 0" class="border-t border-light-grey py-4">
                        <div class="text-a2 font-medium uppercase">{{ productData?.productModel?.optionsLabel }}</div>
                        <div class="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                            <template v-for="product in productData?.productModel?.products" :key="product?.product?._id">
                                <div v-if="product.product?.store?.slug?.current">
                                    <NuxtLink 
                                        :to="`/shop/${product.product?.store?.slug?.current}`" 
                                        class="flex items-center gap-2 hover:text-black transition-colors"
                                        :class="route.params.id === product?.product?.store?.slug?.current ? 'text-black' : 'text-grey'"
                                    >
                                        <div 
                                            class="w-4 h-4 rounded-full border relative overflow-hidden bg-beige"
                                            :class="route.params.id === product?.product?.store?.slug?.current ? 'border-black' : 'border-transparent'"
                                        >
                                            <CommonMediaImage
                                                v-if="product?.swatch || product?.product?.featuredImage"
                                                :image="product.swatch || product?.product?.featuredImage"
                                                :alt="product.optionName"
                                                width="32"
                                                mobileWidth="32"
                                                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover rounded-full"
                                                :class="[
                                                    route.params.id === product?.product?.store?.slug?.current ? 'w-2.5 h-2.5' : 'w-4 h-4',
                                                    // {
                                                    //     'scale-[2]': !product.swatch
                                                    // }
                                                ]" 
                                            />
                                        </div>
                                        <div class="text-p2">{{ product?.optionName }}</div>
                                    </NuxtLink>
                                </div>  
                            </template>
                        </div>
                    </div>

                    <div v-if="productData?.store?.variants && productData?.store?.variants?.length > 1" class="border-t border-light-grey py-4">
                        <div class="text-a2 font-medium uppercase">
                            <template v-for="(option, index) in productData?.store?.options" :key="option?._id">
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

                    <template v-if="activeMetaFields.length > 0">
                        <div 
                            v-for="metaField in activeMetaFields" 
                            :key="metaField._key" 
                            class="border-t border-light-grey"
                        >
                            <button 
                                @click="toggleMetaField(metaField._key)"
                                class="w-full flex items-center justify-between text-left hover:text-black transition-colors py-4"
                            >
                                <div 
                                    class="text-a2 font-medium uppercase transition-colors duration-300 hover:text-black"
                                    :class="openMetaFields.has(metaField._key) ? 'text-black' : 'text-grey'"
                                >{{ metaField.title }}</div>
                                <div class="transition-transform object-center duration-300" :class="openMetaFields.has(metaField._key) ? 'rotate-45' : 'rotate-0'">
                                    <svg class="size-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                                    </svg>
                                </div>
                            </button>
                            <Transition name="fade">
                                <div v-if="openMetaFields.has(metaField._key)" class="overflow-hidden max-h-48">
                                    <div class="pb-4">
                                        <div class="text-p2">{{ metaField.description }}</div>
                                    </div>
                                </div>
                            </Transition>
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

                <div v-if="productData?.isPersonalizable" class="mt-6 text-p2">
                    Personalize this product. 
                    <NuxtLink :to="inquiryLink" class="font-medium inline-flex gap-1.5 items-center hover:text-grey transition-colors duration-300">
                        <span>Contact us</span>
                        <IconsArrow class="w-3 h-auto" />
                    </NuxtLink>
                </div>

                <div v-if="productData?.onlyUAE" class="mt-3 text-p2 whitespace-pre-line">
                    {{ siteSettingsData?.onlyUAE }}
                </div>

                <div v-if="siteSettingsData?.shippingPolicy" class="mt-10">
                    <NuxtLink 
                        :to="`/info/${siteSettingsData?.shippingPolicy?.slug.current}`"
                        target="_blank"
                        class="text-a2 lowercase text-grey hover:text-black transition-colors" 
                    >
                        Shipping & Returns Policy
                    </NuxtLink>
                </div>
            </div>
        </div>

        <!-- Crafts -->
        <div v-if="(productData?.crafts && productData?.crafts?.length > 0) || (productData?.productModel?.crafts && productData?.productModel?.crafts?.length > 0)" class="mt-20 sm:mt-24 lg:mt-30">
            <CommonAsideHeading title="Crafts used in this product" />
            <CraftsGrid :crafts="productData?.crafts || productData?.productModel?.crafts" />
        </div>

        <!-- Making of -->
        <div v-if="(productData?.makingOf && productData?.makingOf?.length > 0) || (productData?.productModel?.makingOf && productData?.productModel?.makingOf?.length > 0)" class="mt-20 sm:mt-24 lg:mt-30">
            <CommonAsideHeading title="Making of" />
            <ShopProductMakingOf :mediaItems="productData?.makingOf || productData?.productModel?.makingOf" />
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
import { useProductSchema } from '@/composables/structuredData'
import { getProductBySlug } from '@/data/product'

const route = useRoute()
const productData = await getProductBySlug(route.params.id)
const siteUrl = 'https://nadadebs.netlify.app'

const defaultBackRoute = computed(() =>
    productData.value?.category === 'furniture' ? '/shop/furniture' : '/shop/objects'
)

const siteSettingsData = inject('siteSettingsData')
const cartStore = useCartStore()
const countryStore = useCountryStore()
const currentProductStore = useCurrentProductStore()
const selectedVariant = ref(productData?.value?.store?.variants?.[0])
const variantAvailability = ref({})
const variantAvailabilityLoading = ref(false)
const openMetaFields = ref(new Set())

// Set the current product in the global store
watch(() => productData.value, (newProductData) => {
  if (newProductData) {
    currentProductStore.setCurrentProduct(newProductData)
  }
}, { immediate: true })

// Sync selectedVariant to first variant when product loads (handles init timing for variable products)
watch(
  () => productData.value?.store?.variants,
  (variants) => {
    if (variants?.length > 1 && !selectedVariant.value) {
      selectedVariant.value = variants[0]
    }
  },
  { immediate: true }
)

// Clear the current product when leaving the page
onUnmounted(() => {
  currentProductStore.clearCurrentProduct()
})

function toggleMetaField(key) {
    if (openMetaFields.value.has(key)) {
        openMetaFields.value.delete(key)
    } else {
        openMetaFields.value.add(key)
    }
}

async function updateAllVariantAvailability() {
    if (!productData.value?.store?.variants) return
    variantAvailabilityLoading.value = true
    const availability = {}
    for (const variant of productData.value.store.variants) {
        if (variant?.store?.gid && productData?.value?.store?.gid && countryStore?.country) {
            try {
                const available = await fetchVariantAvailability(
                    variant.store.gid,
                    productData.value.store.gid,
                    countryStore.country
                )
                availability[variant?.store?.gid] = available === true
            } catch (e) {
                availability[variant?.store?.gid] =
                    variant?.store?.inventory ? variant?.store?.inventory?.isAvailable !== false : false
            }
        } else {
            availability[variant?.store?.gid] =
                variant?.store?.inventory ? variant?.store?.inventory?.isAvailable !== false : false
        }
    }
    variantAvailability.value = availability
    variantAvailabilityLoading.value = false
}

// Meta fields: use selected variant's when product has multiple variants, else product/productModel
const activeMetaFields = computed(() => {
    const hasMultipleVariants = productData?.value?.store?.variants?.length > 1
    const variantMetaFields = selectedVariant?.value?.metaFields
    if (hasMultipleVariants && selectedVariant?.value && variantMetaFields?.length > 0) {
        return variantMetaFields
    }
    return productData?.value?.metaFields || productData?.value?.productModel?.metaFields || []
})

// Gallery images: use selected variant's preview + images when product has multiple variants
const hasMultipleVariants = computed(() => (productData?.value?.store?.variants?.length ?? 0) > 1)
const activePreviewImage = computed(() => {
    if (hasMultipleVariants.value && selectedVariant?.value?.store?.previewImageUrl) {
        return selectedVariant.value.store.previewImageUrl
    }
    return productData?.value?.store?.previewImageUrl ?? ''
})
// For variable products with no Shopify preview URL, use first variant editorial image as main image
const activeFeaturedImage = computed(() => {
    if (hasMultipleVariants.value && selectedVariant?.value?.images?.[0]) {
        return selectedVariant.value.images[0]
    }
    return productData?.value?.featuredImage
})
const activeSecondaryImage = computed(() => productData?.value?.secondaryImage)
const activeMoreImages = computed(() => {
    if (hasMultipleVariants.value && selectedVariant?.value?.images?.length > 0) {
        return selectedVariant.value.images.slice(1)
    }
    return productData?.value?.moreImages ?? []
})

const inquiryLink = computed(() => {
    const slug = productData?.value?.store?.slug?.current
    const productPagePath = slug ? `/shop/${slug}` : ''
    const productPageLink = siteUrl && productPagePath ? `${siteUrl}${productPagePath}` : productPagePath

    return {
        path: '/connect/contact-us',
        query: {
            inquiry: productData?.value?.store?.title || '',
            inquiryTitle: productData?.value?.store?.title || '',
            inquiryImage: productData?.value?.store?.previewImageUrl || '',
            inquiryLink: productPageLink,
            inquiryProductId: productData?.value?.store?.id || productData?.value?.store?.gid || ''
        }
    }
})

// Show gallery when we have any image source (preview URL, featured, secondary, more, or model images)
const hasGalleryImages = computed(() =>
    !!(
        activePreviewImage.value ||
        activeFeaturedImage.value ||
        activeSecondaryImage.value ||
        (activeMoreImages.value?.length > 0) ||
        (productData?.value?.productModel?.images?.length > 0)
    )
)

// Compute if all variants are unavailable for initial AddToCart state
const allVariantsUnavailable = computed(() => {
    if (variantAvailabilityLoading.value) return false // Don't show sold out while loading
    if (!productData.value?.store?.variants) return true
    return productData.value.store.variants.every(v => {
        if (v?.store?.gid && variantAvailability.value[v?.store?.gid] !== undefined) {
            return !variantAvailability.value[v?.store?.gid]
        }
        // fallback to static inventory if needed
        if (v?.store?.inventory && v?.store?.inventory?.management !== 'NOT_MANAGED' && v?.store?.inventory?.isAvailable === false) return true
        return false
    })
})

watch(() => countryStore.country, updateAllVariantAvailability, { immediate: true })

definePageMeta({
    layout: 'default',
    scrollToTop: true,
})

// store.title first, because that is what the <h1> above renders. The Sanity
// `title` is the generic parent name ("Angular Vase") shared by every variant,
// while store.title is the specific one ("Ochaya Walnut Angular Vase") — so
// preferring `title` gave three variants the same <title> while showing three
// different headings.
//
// This only takes effect where seo.ogtitle is empty. The variants flagged as
// duplicates in the Sep 2026 audit have ogtitle explicitly set to the same
// generic string, which correctly still wins; those have to be cleared or
// differentiated in Sanity. See .docs/seo-sanity-tasks.md.
useSeoObject(
    productData?.value?.seo,
    productData?.value?.store?.title || productData?.value?.title,
    productData?.value?.featuredImage,
)
useProductSchema(productData?.value)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease, max-height 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    max-height: 0;
}
</style>
