<template>
  <div
    class="cart-drawer flex flex-col fixed top-0 right-0 h-full bg-white z-50 overflow-y-auto w-[340px] border text-black"
    :class="{ 'translate-x-0': isOpen, 'translate-x-full pointer-events-none': !isOpen }">
    <header class="sticky flex justify-between top-0 bg-white z-50 p-[20px]">
      <h4 class="uppercase">Cart</h4>
      <button class="uppercase" @click="$emit('close')">Close</button>
    </header>
    <div class="p-[20px] h-full">
      <div v-if="cart?.lineItems?.length" class="h-full flex flex-col">
        <ul class="flex flex-col gap-y-[20px]">
          <li v-for="item in cart?.lineItems" :key="item?.id" class="cart-item flex gap-2">
            <img class="w-[100px] h-auto mr-20px object-contain" :src="item?.variant?.image?.src"
              :alt="item?.variant?.product?.title" />
            <div>
              <h3 class="">{{ item?.variant?.product?.title }}</h3>
              <template v-for="selectedOption in item?.variant?.selectedOptions">
                <p><span class="">{{ selectedOption?.name }}: </span>{{ selectedOption?.value }}</p>
              </template>
              <p>Quantity: {{ item?.quantity }}</p>
              <p>Price: {{ formatPrice(item?.variant?.priceV2?.amount, item?.variant?.priceV2?.currencyCode) }}</p>
              <button @click="removeFromCart(item?.id)"
                class="remove-btn hover:text-[red] transition-colors mt-[10px]">Remove</button>
            </div>
          </li>
        </ul>
        <footer class="sticky bottom-0 left-0 bg-white w-full mt-auto py-[20px]">
          <div class="cart-total mt-[10px] flex w-full justify-between">
            <small class="uppercase">Subtotal</small><span>{{ formatPrice(cart?.totalPriceV2?.amount,
              cart?.totalPriceV2?.currencyCode) }}</span>
          </div>
          <small class="block mt-[10px] uppercase">Shipping and discount codes are added at checkout.</small>

          <NuxtLink class="mt-[20px] flex w-full border p-[10px] justify-center hover:bg-black hover:text-white uppercase"
            :to="cart?.checkoutUrl" :disabled="!cart?.checkoutUrl">Checkout</NuxtLink>
        </footer>
      </div>
      <div v-else>
        <p>Your cart is empty</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'
import { removeFromCart as removeFromCartComposable } from '@/composables/shopify'

const props = defineProps({
  cart: Object,
  isOpen: Boolean
})

const cartStore = useCartStore()

const removeFromCart = async (lineItemId) => {
  const updatedCart = await removeFromCartComposable(lineItemId)
  cartStore.setCart(updatedCart) // Directly update the cart state
  cartStore.setCartOpen(true) // Open the cart drawer
}
</script>

<style scoped>
.cart-drawer {
  transition: transform 350ms cubic-bezier(0.165, 0.84, 0.44, 1);
}
</style>
