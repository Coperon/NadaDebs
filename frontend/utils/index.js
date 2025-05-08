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
    switch (currencyCode) {
        case 'USD':
            return '$'
        case 'EUR':
            return '€'
        case 'GBP':
            return '£'
        default:
            return '€'
    }
}

export const formatPrice = (price, currencyCode) => {
    // check if currency symbol should be placed before or after the price
    // make sure price is in the correct format. E.g. 10.00
    let numberPrice = parseFloat(price) 
    let priceToPrint = numberPrice.toFixed(2)
    
    if (!currencyCode) {
        return priceToPrint
    }
    if (currencyCode === 'USD' || currencyCode === 'GBP') {
        return `${currencyCodeToSymbol(currencyCode)}${priceToPrint}`
    }
    return `${priceToPrint}${currencyCodeToSymbol(currencyCode)}`
}