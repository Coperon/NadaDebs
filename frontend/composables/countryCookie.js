import { useCookie } from '#app'

/** Checkout currency is always AED (payment provider limitation). */
export const DISPLAY_CURRENCY_CODE = 'AED'
/** Fallback AED symbol; overwritten from Shopify localization when available. */
export const DISPLAY_CURRENCY_SYMBOL = 'د.إ'
/** Country context used for Shopify price queries so amounts match checkout. */
export const PRICE_COUNTRY_CODE = 'AE'

export function getCountryCookie() {
  const countryCookie = useCookie('country_code', { sameSite: 'lax' })
  const currencySymbolCookie = useCookie('currency_symbol', { sameSite: 'lax' })
  // Prefer Shopify-synced AED symbol; ignore legacy $ from before this change
  const storedSymbol = currencySymbolCookie.value
  const currencySymbol =
    storedSymbol && storedSymbol !== '$' ? storedSymbol : DISPLAY_CURRENCY_SYMBOL
  return {
    country: countryCookie.value || 'US',
    currencySymbol,
    currencyCode: DISPLAY_CURRENCY_CODE,
  }
}

export function setCountryCookie(country, symbol = DISPLAY_CURRENCY_SYMBOL) {
  const countryCookie = useCookie('country_code', { sameSite: 'lax' })
  const currencySymbolCookie = useCookie('currency_symbol', { sameSite: 'lax' })
  const currencyCodeCookie = useCookie('currency_code', { sameSite: 'lax' })
  countryCookie.value = country
  currencySymbolCookie.value = symbol
  currencyCodeCookie.value = DISPLAY_CURRENCY_CODE
}
