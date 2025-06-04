<template>
    <div class="article-body flex flex-col flex-1 w-full h-full gap-y-2">
        <div class="grid grid-cols-12 w-full">
            <div class="block col-span-12 lg:col-span-6 bg-gray">
                <CommonMediaImage v-if="productData?.featuredImage" class="block w-full h-auto"
                    :image="productData?.featuredImage" :alt="productData?.store?.title" width="700" height="700"
                    mobileWidth="400" mobileHeight="400" />
            </div>
            <div class="flex flex-col gap-y-4 p-2 h-full col-span-12 lg:col-span-6 mt-32">
                <h1 class="uppercase">{{ productData?.store?.title }}</h1>
                <ShopProductPrice
                  :price="selectedVariant
                    ? { minVariantPrice: selectedVariant.store.price, maxVariantPrice: selectedVariant.store.price }
                    : {}"
                  :productGid="productData?.store?.gid"
                />
                <div class="w-fit" v-if="productData.store.variants && productData.store.variants.length > 1">
                    <ShopProductVariants 
                        :variants="productData.store.variants" 
                        :selectedVariant="selectedVariant"
                        :productGid="productData?.store?.gid"
                        :variantAvailability="variantAvailability"
                        :variantAvailabilityLoading="variantAvailabilityLoading"
                        @update:selectedVariant="selectedVariant = $event" 
                    />
                </div>

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
</template>

<script setup>
import { buildBodyClass } from '@/utils'
import { useSeoObject } from '@/composables/seo'
import { getProductBySlug } from '@/data/shop'
import { useCartStore } from '@/stores/cart'
import { fetchVariantAvailability } from '@/composables/shopify'
import { useCountryStore } from '@/stores/country'

const route = useRoute()
const routeName = route.name
const productData = await getProductBySlug(route.params.id)
const bodyClass = buildBodyClass(routeName)

// Start with no variant selected, so price range is shown initially
const selectedVariant = ref(null)

const siteSettingsData = inject('siteSettingsData')
const cartStore = useCartStore()
const countryStore = useCountryStore()
const variantAvailability = ref({})
const variantAvailabilityLoading = ref(false)

definePageMeta({
    layout: 'default',
    // Add scroll reset. By default nuxt does not reset scroll to top for child routes
    scrollToTop: true,
})

// add body class with usehead
useHead({
    bodyAttrs: {
        class: bodyClass,
    },
})
useSeoObject(
    productData?.value?.seo,
    productData?.value?.title || productData?.value?.store?.title,
    productData?.value?.featuredImage,
)

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
</script>