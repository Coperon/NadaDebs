import { useCookie } from '#app'

export function getCountryCookie() {
  const countryCookie = useCookie('country_code', { sameSite: 'lax' })
  const currencySymbolCookie = useCookie('currency_symbol', { sameSite: 'lax' })
  const currencyCodeCookie = useCookie('currency_code', { sameSite: 'lax' })
  return {
    country: countryCookie.value || 'US',
    currencySymbol: currencySymbolCookie.value || '$',
    currencyCode: currencyCodeCookie.value || 'USD',
  }
}

export function setCountryCookie(country, symbol = '$', code = 'USD') {
  const countryCookie = useCookie('country_code', { sameSite: 'lax' })
  const currencySymbolCookie = useCookie('currency_symbol', { sameSite: 'lax' })
  const currencyCodeCookie = useCookie('currency_code', { sameSite: 'lax' })
  countryCookie.value = country
  currencySymbolCookie.value = symbol
  currencyCodeCookie.value = code
}
