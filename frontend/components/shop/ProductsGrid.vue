<template>
    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-2.5 gap-y-8 md:gap-y-12 xl:gap-y-16">
        <div v-for="product in products" :key="product._id">
            <NuxtLink :to="`/shop/${product.store.slug.current}`" class="group">
                <div class="aspect-square relative overflow-hidden bg-white">
                    <div class="aspect-square w-full h-full bg-beige/30">
                        <template v-if="product?.featuredImage || product?.store?.previewImageUrl">
                            <CommonMediaImage
                                v-if="product?.featuredImage"
                                :image="product.featuredImage"
                                :alt="product.store.title"
                                width="512"
                                mobileWidth="512"
                                class="absolute inset-0 w-full h-full object-contain"
                            />
                            <img
                                v-else
                                :src="product?.store?.previewImageUrl"
                                :srcset="`${product?.store?.previewImageUrl}?w=512 512w, ${product?.store?.previewImageUrl}?w=1024 1024w`"
                                sizes="(min-width: 1280px) 512px, (min-width: 768px) 512px, 256px"
                                :alt="product.store.title"
                                class="absolute inset-0 w-full h-full object-contain"
                            />
                            <CommonMediaImage
                                v-if="product?.secondaryImage"
                                :image="product.secondaryImage"
                                :alt="product.store.title"
                                width="512"
                                mobileWidth="512"
                                class="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            />
                        </template>
                    </div>
                </div>

                <CommonGridCaption>
                    <h2 class="text-h2">{{ product.store.title }}</h2>
                    <div class="mt-1 text-grey group-hover:text-black transition-colors">
                        <template v-if="product?.buyOptions?.onlyInquire && product?.buyOptions?.hidePrice">
                            Price upon request
                        </template>
                        <template v-else>
                            <ShopProductPrice :productGid="product?.store?.gid" :price="product?.store?.priceRange" />
                        </template>
                    </div>
                </CommonGridCaption>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
defineProps({
    products: {
        type: Array,
        required: true,
    },
})
</script>