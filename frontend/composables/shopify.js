import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { useCartStore } from '@/stores/cart';
import { useCountryStore } from '@/stores/country';

// Constants
const CART_LINES_LIMIT = 10;
const VARIANTS_LIMIT = 100;
const CART_COOKIE_NAME = 'shopify_cart_id';
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

let shopiClient;

const makeGraphQLRequest = async (query, variables) => {
    if (!shopiClient) {
        console.error('Shopify client not initialized. Call initShopify() first.');
        return null;
    }
    const { data, errors } = await shopiClient.request(query, { variables });
    if (errors) {
        console.error('GraphQL Errors:', errors);
        return null;
    }
    return data;
};

const transformCartData = (cartData) => {
    if (!cartData) return null;
    
    return {
        id: cartData.id,
        checkoutUrl: cartData.checkoutUrl,
        lineItems: cartData.lines.edges.map(edge => {
            const variant = edge.node.merchandise;
            if (!variant.product) {
                console.warn('Missing product for variant:', variant?.id);
            }

            // Handle default variant case
            const isDefaultVariant = variant.selectedOptions.length === 1 && variant.selectedOptions[0].name === 'Title';

            return {
                id: edge.node.id,
                quantity: edge.node.quantity,
                variant: {
                    id: variant.id,
                    title: variant.title,
                    image: variant.image,
                    priceV2: variant.priceV2,
                    selectedOptions: isDefaultVariant ? [] : variant.selectedOptions,
                    product: variant.product ? {
                        title: variant.product.title,
                        handle: variant.product.handle
                    } : null
                }
            };
        }),
        totalPriceV2: cartData.estimatedCost.totalAmount
    };
};

const cartFragment = `
    fragment CartFragment on Cart {
        id
        checkoutUrl
        lines(first: ${CART_LINES_LIMIT}) {
            edges {
                node {
                    id
                    quantity
                    merchandise {
                        ... on ProductVariant {
                            id
                            title
                            image {
                                src
                            }
                            priceV2 {
                                amount
                                currencyCode
                            }
                            product {
                                title
                                handle
                            }
                            selectedOptions {
                                name
                                value
                            }
                        }
                    }
                }
            }
        }
        estimatedCost {
            totalAmount {
                amount
                currencyCode
            }
        }
    }
`;

const cartQuery = `
    query ($cartId: ID!) {
        cart(id: $cartId) {
            ...CartFragment
        }
    }
    ${cartFragment}
`;

const cartLinesAddMutation = `
    mutation ($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
            cart {
                ...CartFragment
            }
            userErrors {
                message
                code
                field
            }
        }
    }
    ${cartFragment}
`;

const cartCreateMutation = `
    mutation ($input: CartInput!) {
        cartCreate(input: $input) {
            userErrors {
                message
                code
                field
            }
            cart {
                ...CartFragment
            }
        }
    }
    ${cartFragment}
`;

const cartLinesRemoveMutation = `
    mutation ($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
            cart {
                ...CartFragment
            }
            userErrors {
                message
                code
                field
            }
        }
    }
    ${cartFragment}
`;

// 1. Query available countries and currencies
export const getAvailableCountries = async (country = 'US') => {
    const query = `
      query getAvailableCountries($country: CountryCode) @inContext(country: $country) {
        localization {
          availableCountries {
            currency {
              isoCode
              name
              symbol
            }
            isoCode
            name
            unitSystem
          }
          country {
            currency {
              isoCode
              name
              symbol
            }
            isoCode
            name
            unitSystem
          }
        }
      }
    `;
    const data = await makeGraphQLRequest(query, { country });
    return data?.localization;
};

// 2. Store and use selected country in all queries/mutations
// Example composable for country selection
export const initShopify = async () => {
    const runtimeConfig = useRuntimeConfig();
    const storeDomain = runtimeConfig?.public?.shopifyStoreDomain;
    const storePublicAccessToken = runtimeConfig?.public?.shopifyStorefrontAccessToken;
    
    shopiClient = createStorefrontApiClient({
        storeDomain,
        apiVersion: '2026-04',
        publicAccessToken: storePublicAccessToken
    });

    const cartStore = useCartStore();
    const cartIdCookie = useCookie(CART_COOKIE_NAME, {
        maxAge: CART_COOKIE_MAX_AGE,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
    });
    
    const cartId = cartIdCookie.value;
    if (cartId) {
        const data = await makeGraphQLRequest(cartQuery, { cartId });
        if (!data?.cart) return shopiClient;

        const cart = transformCartData(data.cart);
        if (cart) {
            cartStore.setCart(cart);
        }
    }

    return shopiClient;
};

export const addToCart = async (product, variantId) => {
    if (!variantId && product?.store?.variants?.length > 0) {
        variantId = product.store.variants[0].store.gid;
    }
    
    const merchandiseId = variantId || '';
    if (!merchandiseId) {
        console.error('No valid merchandise ID available for this product');
        return null;
    }
    
    const cartStore = useCartStore();
    const countryStore = useCountryStore();
    const cartIdCookie = useCookie(CART_COOKIE_NAME, {
        maxAge: CART_COOKIE_MAX_AGE,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
    });
    
    const lineItems = [{ merchandiseId, quantity: 1 }];
    const cart = cartStore.cart;
    
    if (cart?.id) {
        const data = await makeGraphQLRequest(cartLinesAddMutation, {
            cartId: cart.id,
            lines: lineItems
        });
        
        if (!data?.cartLinesAdd) return null;
        if (data.cartLinesAdd.userErrors?.length > 0) {
            console.error('Cart add errors:', data.cartLinesAdd.userErrors);
            return null;
        }

        const updatedCart = transformCartData(data.cartLinesAdd.cart);
        if (updatedCart) {
            cartStore.setCart(updatedCart);
            cartStore.setCartOpen(true);
        }
        return updatedCart;
    } else {
        const data = await makeGraphQLRequest(cartCreateMutation, {
            input: {
                lines: lineItems,
                buyerIdentity: { countryCode: countryStore.country }
            }
        });
        
        if (!data?.cartCreate) return null;
        if (data.cartCreate.userErrors?.length > 0) {
            console.error('Cart create errors:', data.cartCreate.userErrors);
            return null;
        }

        const newCart = transformCartData(data.cartCreate.cart);
        if (newCart) {
            cartStore.setCart(newCart);
            cartIdCookie.value = newCart.id;
            cartStore.setCartOpen(true);
        }
        return newCart;
    }
};

export const removeFromCart = async (lineItemId) => {
    const cartStore = useCartStore();
    const cartIdCookie = useCookie(CART_COOKIE_NAME);
    const cartId = cartIdCookie.value;

    if (!cartId) {
        console.error('No cart ID found');
        return null;
    }

    const data = await makeGraphQLRequest(cartLinesRemoveMutation, {
        cartId,
        lineIds: [lineItemId]
    });
    
    if (!data?.cartLinesRemove) return null;
    if (data.cartLinesRemove.userErrors?.length > 0) {
        console.error('Cart remove errors:', data.cartLinesRemove.userErrors);
        return null;
    }

    const updatedCart = transformCartData(data.cartLinesRemove.cart);
    if (updatedCart) {
        cartStore.setCart(updatedCart);
    }
    return updatedCart;
};

export const fetchShopifyProductPrice = async (productGid, country) => {
  const query = `
    query getProduct($id: ID!, $country: CountryCode) @inContext(country: $country) {
      product(id: $id) {
        priceRange {
          minVariantPrice { amount currencyCode }
          maxVariantPrice { amount currencyCode }
        }
      }
    }
  `;
  const data = await makeGraphQLRequest(query, { id: productGid, country });
  return data?.product?.priceRange;
};

export const fetchVariantPrice = async (variantGid, productGid, country) => {
  const query = `
    query getVariantPrice($productId: ID!, $country: CountryCode) @inContext(country: $country) {
      product(id: $productId) {
        variants(first: ${VARIANTS_LIMIT}) {
          edges {
            node {
              id
              priceV2 {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;
  const data = await makeGraphQLRequest(query, { productId: productGid, country });
  const variants = data?.product?.variants?.edges || [];
  const variant = variants.find(v => v.node.id === variantGid);
  return variant?.node?.priceV2;
};

export const fetchVariantAvailability = async (variantGid, productGid, country) => {
  const query = `
    query getVariant($productId: ID!, $country: CountryCode) @inContext(country: $country) {
      product(id: $productId) {
        variants(first: ${VARIANTS_LIMIT}) {
          edges {
            node {
              id
              availableForSale
            }
          }
        }
      }
    }
  `;
  const data = await makeGraphQLRequest(query, { productId: productGid, country });
  const variants = data?.product?.variants?.edges || [];
  const variant = variants.find(v => v.node.id === variantGid);
  return variant?.node?.availableForSale;
};

export const fetchProductsAvailability = async (productGids, country) => {
  if (!productGids?.length) return {}

  const BATCH_SIZE = 250
  const result = {}

  for (let i = 0; i < productGids.length; i += BATCH_SIZE) {
    const batch = productGids.slice(i, i + BATCH_SIZE)
    const query = `
      query getProductsAvailability($ids: [ID!]!, $country: CountryCode) @inContext(country: $country) {
        nodes(ids: $ids) {
          ... on Product {
            id
            variants(first: ${VARIANTS_LIMIT}) {
              edges {
                node {
                  availableForSale
                }
              }
            }
          }
        }
      }
    `
    const data = await makeGraphQLRequest(query, { ids: batch, country })
    const nodes = data?.nodes || []
    for (const product of nodes) {
      if (product?.id) {
        result[product.id] = product.variants?.edges?.some(e => e.node?.availableForSale) ?? false
      }
    }
  }

  return result
};

export const updateCartBuyerIdentity = async (cartId, countryCode) => {
  const mutation = `
    mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
      cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
        cart {
          ...CartFragment
        }
        userErrors {
          message
          code
          field
        }
      }
    }
    ${cartFragment}
  `;
  const data = await makeGraphQLRequest(mutation, {
    cartId,
    buyerIdentity: { countryCode }
  });
  
  if (!data?.cartBuyerIdentityUpdate) return null;
  if (data.cartBuyerIdentityUpdate.userErrors?.length > 0) {
    console.error('Cart buyer identity update errors:', data.cartBuyerIdentityUpdate.userErrors);
    return null;
  }
  
  const updatedCart = transformCartData(data.cartBuyerIdentityUpdate.cart);
  if (updatedCart) {
    const cartStore = useCartStore();
    cartStore.setCart(updatedCart);
  }
  return updatedCart;
};
