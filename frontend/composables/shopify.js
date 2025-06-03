import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { useCartStore } from '@/stores/cart';
import { useCountryStore } from '@/stores/country'

let shopiClient;

const makeGraphQLRequest = async (query, variables) => {
    const { data, errors } = await shopiClient.request(query, { variables });
    if (errors) {
        console.error('GraphQL Errors:', errors);
        return null;
    }
    // console.log('GraphQL Response:', JSON.stringify(data, null, 2)); // Log full response
    return data;
};

const transformCartData = (cartData) => {
    return {
        id: cartData?.id,
        checkoutUrl: cartData?.checkoutUrl,
        lineItems: cartData?.lines.edges.map(edge => {
            const variant = edge.node.merchandise;
            if (!variant.product) {
                console.warn('Missing product for variant:', variant?.id); // Log missing product
            }
            const options = variant.selectedOptions.reduce((acc, option) => {
                acc[option.name.toLowerCase()] = option.value;
                return acc;
            }, {});

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
                    product: variant.product ? { // Add null check for product
                        title: variant.product.title
                    } : null
                }
            };
        }),
        totalPriceV2: cartData?.estimatedCost.totalAmount
    };
};

const cartFragment = `
    fragment CartFragment on Cart {
        id
        checkoutUrl
        lines(first: 10) {
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
        storeDomain: storeDomain,
        apiVersion: '2025-01',
        publicAccessToken: storePublicAccessToken
    });

    const cartStore = useCartStore();
    const cartIdCookie = useCookie('shopify_cart_id');
    const cartId = cartIdCookie.value;
    if (cartId) {
        const data = await makeGraphQLRequest(cartQuery, { cartId });
        if (!data) return;

        const cart = transformCartData(data.cart);
        cartStore.setCart(cart);
    }

    return shopiClient;
};

export const addToCart = async (product, variantId) => {
    if (!variantId && product.store.variants && product.store.variants.length > 0) {
        variantId = product.store.variants[0].store.gid // Default to the first variant if none selected
    }
    const cartStore = useCartStore();
    const cartIdCookie = useCookie('shopify_cart_id');
    let merchandiseId = variantId || '';
    if (!merchandiseId) {
        console.error('No valid merchandise ID available for this product');
        return;
    }
    const lineItems = [{ merchandiseId, quantity: 1 }];

    const cart = cartStore.cart;
    if (cart && cart.id) {
        const data = await makeGraphQLRequest(cartLinesAddMutation, {
            cartId: cart.id,
            lines: lineItems
        });
        if (!data) return;

        const updatedCart = transformCartData(data.cartLinesAdd.cart);
        cartStore.setCart(updatedCart);
        cartStore.setCartOpen(true); // Open the cart drawer
        return updatedCart; // Return the updated cart state
    } else {
        // Use buyerIdentity for market context
        const { useCountryStore } = await import('@/stores/country')
        const countryStore = useCountryStore()
        const data = await makeGraphQLRequest(cartCreateMutation, {
            input: {
                lines: lineItems,
                buyerIdentity: { countryCode: countryStore.country }
            }
        });
        if (!data) return;

        const newCart = transformCartData(data.cartCreate.cart);
        cartStore.setCart(newCart);
        cartIdCookie.value = newCart.id;
        cartStore.setCartOpen(true); // Open the cart drawer
        return newCart; // Return the new cart state
    }
};

export const removeFromCart = async (lineItemId) => {
    const cartStore = useCartStore();
    const cartIdCookie = useCookie('shopify_cart_id');
    const cartId = cartIdCookie.value;

    if (!cartId) {
        console.error('No cart ID found');
        return;
    }

    const data = await makeGraphQLRequest(cartLinesRemoveMutation, {
        cartId,
        lineIds: [lineItemId]
    });
    if (!data) return;

    const updatedCart = transformCartData(data.cartLinesRemove.cart);
    cartStore.setCart(updatedCart);
    return updatedCart; // Return the updated cart state
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
  `
  const data = await makeGraphQLRequest(query, { id: productGid, country })
  return data?.product?.priceRange
}

export const fetchVariantAvailability = async (variantGid, productGid, country) => {
    console.log('Fetching variant availability for:', variantGid, productGid, 'in country:', country);
  const query = `
    query getVariant($productId: ID!, $country: CountryCode) @inContext(country: $country) {
      product(id: $productId) {
        variants(first: 100) {
          edges {
            node {
              id
              availableForSale
            }
          }
        }
      }
    }
  `
  const data = await makeGraphQLRequest(query, { productId: productGid, country })
  const variants = data?.product?.variants?.edges || []
  console.log('Variants:', variants) // Log the fetched variants for debugging
  const variant = variants.find(v => v.node.id === variantGid)
  return variant?.node?.availableForSale
}

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
  return data?.cartBuyerIdentityUpdate?.cart;
};
