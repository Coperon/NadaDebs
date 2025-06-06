// Utils are typically simple, pure functions that take some input and return some output without causing any side effects.
// They are used for common tasks that are used throughout the application

// check if the device supports touch
export function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints
}

export function getFileExtension(filename) {
    if (!filename) return ''
    return filename.split('.').pop()
}

// convert a string to a slug
export function simpleSlugify(str, preserveSpaces = false) {
    if (!str || !document) {
        return ''
    }
    let tempDiv = document.createElement('div')
    tempDiv.innerHTML = str
    let decodedString = tempDiv.innerText
    // remove accents, swap ñ for n, etc
    decodedString = decodedString
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
    // remove dashes
    decodedString = decodedString.replace(/-/g, '')
    // replace spaces with a placeholder if preserveSpaces is true
    if (preserveSpaces) {
        decodedString = decodedString.replace(/\s+/g, '_')
    }
    // replace spaces (or placeholders) with dashes (or spaces)
    return decodedString
        .toLowerCase()
        .replace(/_+/g, preserveSpaces ? ' ' : '-')
}

// parse path and return body class name

export function buildBodyClass(path) {
    if (path) {
        return path == '/' ? 'home' : 'page-' + path.replace(/\//g, ' ').trim()
    }
    return ''
}

// get year from sanity date string
export function getYearFromStringDate(dateStr) {
    if (!dateStr) return
    let date = new Date(dateStr)
    let year = date.getFullYear()
    return year.toString()
}

// format date string to 'day/month/year'
export function formatDate(dateStr) {
    if (!dateStr) return
    let date = new Date(dateStr)
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    return `${day}/${month}/${year}`
}


export const currencyCodeToSymbol = (currencyCode) => {
    // Deprecated: always use the symbol from the Shopify API if available
    return currencyCode || ''
}

export const formatPrice = (price, currencyCode='USD', symbol='$') => {
    if (price && typeof price === 'object' && 'amount' in price) {
        price = price.amount
    }
    let numberPrice = parseFloat(price)
    if (isNaN(numberPrice)) return ''
    let priceToPrint = numberPrice.toString()
    // Prefer API symbol if provided
    if (currencyCode === 'USD' || currencyCode === 'GBP') {
        return `${symbol}${priceToPrint}`
    }
   return `${priceToPrint}${symbol}`
}