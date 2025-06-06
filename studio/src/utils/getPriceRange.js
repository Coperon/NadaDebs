import {DEFAULT_CURRENCY_CODE} from  '../../constants'

const formatNumber = (val) => {
  return new Intl.NumberFormat('en', {
    currency: DEFAULT_CURRENCY_CODE,
    style: 'currency',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val)
}

export const getPriceRange = (price) => {
  if (!price || typeof price?.minVariantPrice === 'undefined') {
    return 'No price found'
  }
  if (price.maxVariantPrice && price.minVariantPrice !== price.maxVariantPrice) {
    return `${formatNumber(price.minVariantPrice)} – ${formatNumber(price.maxVariantPrice)}`
  }

  return formatNumber(price.minVariantPrice)
}
