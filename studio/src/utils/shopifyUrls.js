import {SHOPIFY_STORE_ID} from '../../constants'

const storeUrl = `https://admin.shopify.com/store/${SHOPIFY_STORE_ID}`

export const collectionUrl = (collectionId) => {
  if (!SHOPIFY_STORE_ID) {
    return null
  }
  return `${storeUrl}/collections/${collectionId}`
}

export const productUrl = (productId) => {
  if (!SHOPIFY_STORE_ID) {
    return null
  }
  return `${storeUrl}/products/${productId}`
}

export const productVariantUrl = (productId, productVariantId) => {
  if (!SHOPIFY_STORE_ID) {
    return null
  }
  return `${storeUrl}/products/${productId}/variants/${productVariantId}`
}
