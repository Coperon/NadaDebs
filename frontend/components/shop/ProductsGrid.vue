<template>
    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-2.5 gap-y-8 md:gap-y-12 xl:gap-y-16">
        <div v-for="product in products" :key="product._id" :class="product.isFeatured ? 'col-span-2' : ''">
            <NuxtLink :to="`/shop/${product.store.slug.current}`" class="group">
                <div v-if="product?.featuredImage || product?.store?.previewImageUrl" class="relative overflow-hidden bg-beige/30" :class="product.isFeatured ? 'aspect-auto' : 'aspect-[4/5]'">
                    <CommonMediaImage
                        v-if="product?.featuredImage"
                        :image="product.featuredImage"
                        :alt="product.store.title"
                        :width="product.isFeatured ? '1024' : '512'"
                        :mobileWidth="product.isFeatured ? '1024' : '512'"
                        class="w-full h-full object-contain"
                        :class="product.isFeatured ? 'absolute inset-0' : ''"
                    />
                    <img 
                        v-else 
                        :src="product?.store?.previewImageUrl" 
                        :srcset="`${product?.store?.previewImageUrl}?w=512 512w, ${product?.store?.previewImageUrl}?w=1024 1024w`"
                        :sizes="product.isFeatured ? '(min-width: 1280px) 1024px, (min-width: 768px) 1024px, 512px' : '(min-width: 1280px) 512px, (min-width: 768px) 512px, 256px'"
                        :alt="product.store.title" 
                        class="absolute inset-0 w-full h-full object-cover" 
                    />
                    <CommonMediaImage
                        v-if="product?.secondaryImage"
                        :image="product.secondaryImage"
                        :alt="product.store.title"
                        :width="product.isFeatured ? '1024' : '512'"
                        :mobileWidth="product.isFeatured ? '1024' : '512'"
                        class="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <div v-if="product.isFeatured" class="flex gap-x-2.5 w-full pointer-events-none">
                        <div class="aspect-[4/5] flex-1"></div>
                        <div class="aspect-[4/5] flex-1"></div>
                    </div>
                </div>

                <div class="px-4 mt-2.5 lg:mt-5">
                    <h2 class="text-h2">{{ product.store.title }}</h2>
                    <div class="mt-1 text-grey group-hover:text-black transition-colors">
                        <template v-if="product?.buyOptions?.onlyInquire && product?.buyOptions?.hidePrice">
                            Price upon request
                        </template>
                            <template v-else-if="product?.store?.priceRange?.minVariantPrice !== product?.store?.priceRange?.maxVariantPrice">
                            {{ formatPrice(product?.store?.priceRange?.minVariantPrice, siteSettingsData?.currencyCode) }} - {{ formatPrice(product?.store?.priceRange?.maxVariantPrice, siteSettingsData?.currencyCode) }}
                        </template>
                        <template v-else>
                            {{ formatPrice(product?.store?.priceRange?.minVariantPrice, siteSettingsData?.currencyCode) }}
                        </template>
                    </div>
                </div>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
const siteSettingsData = inject('siteSettingsData')

defineProps({
    products: {
        type: Array,
        required: true,
    },
})
</script>