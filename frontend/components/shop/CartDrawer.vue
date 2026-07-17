<template>
    <div 
        class="fixed z-10 inset-0 text-black transition-opacity duration-300"
        :class="{ 'opacity-0 pointer-events-none': !cartStore.isCartOpen }"
    >
        <div 
            class="absolute inset-0"
            :class="route.path.startsWith('/shop/') ? 'bg-beige/20' : 'bg-transparent'"
            @click="$emit('close')"
        ></div>
        
        <div class="bg-white absolute h-svh right-0 w-full sm:max-w-[24rem] overflow-y-auto">
            <div class="h-[3.25rem] sm:h-[4.25rem] flex items-center justify-end px-4 sm:px-6 sticky top-0 z-10 bg-white">
                <button @click="$emit('close')">
                    <div class="w-6 h-6">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </div>
                </button>
            </div>

            <div class="px-4 sm:px-6 pb-12">
                <div v-if="cart?.lineItems?.length" class="flex flex-col gap-8">
                    <div v-for="item in cart?.lineItems" :key="item?.id" class="flex gap-4">
                        <div class="w-1/2">
                            <NuxtLink 
                                :to="`/shop/${item?.variant?.product?.handle}`"
                                @click="cartStore.setCartOpen(false)"
                                class="block bg-beige/30 hover:opacity-50 transition-opacity duration-300"
                            >
                                <img
                                    :src="item?.variant?.image?.src"
                                    :alt="item?.variant?.product?.title"
                                    class="w-full h-auto"
                                />
                            </NuxtLink>
                            <button 
                                @click="removeFromCart(item?.id)"
                                class="mt-4 text-a2 text-grey lowercase hover:text-black transition-colors"
                            >Remove product</button>
                        </div>
                        <div class="w-1/2">
                            <h3 class="text-h2">{{ item?.variant?.product?.title }}</h3>
                            <div v-if="item?.variant?.selectedOptions?.length > 0" class="mt-1.5 text-p2 text-grey">
                                {{ item?.variant?.selectedOptions[0]?.value }}
                            </div>
                            <div class="mt-3">{{ 
                                formatPrice(item?.variant?.priceV2?.amount) 
                            }}</div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <p>Your cart is empty</p>
                </div>
            </div>

            <div v-if="cart?.lineItems?.length" class="sticky bottom-0 bg-white pt-4 pb-12 px-4 sm:px-6">
                <div class="flex w-full justify-between">
                    <div class="text-p2 uppercase">Subtotal</div>
                    <div class="text-h2">{{ formatPrice(cart?.totalPriceV2?.amount) }}</div>
                </div>

                <ClientOnly>
                    <div class="mt-4" v-if="cart?.checkoutUrl">
                        <NuxtLink :to="cart?.checkoutUrl">
                            <CommonButton isSecondary>
                                <div class="flex items-center gap-1.5">
                                    <span>Checkout</span>
                                    <IconsArrow class="w-3 h-auto" />
                                </div>
                            </CommonButton>
                        </NuxtLink>
                    </div>
                </ClientOnly>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'
import { removeFromCart as removeFromCartComposable } from '@/composables/shopify'

const props = defineProps({
    cart: Object,
})

const cartStore = useCartStore()
const route = useRoute()

const removeFromCart = async (lineItemId) => {
    const updatedCart = await removeFromCartComposable(lineItemId)
    cartStore.setCart(updatedCart) // Directly update the cart state
    cartStore.setCartOpen(true) // Open the cart drawer
}
</script>
