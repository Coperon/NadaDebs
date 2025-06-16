export default {
    name: 'relatedProducts',
    title: 'Related Products',
    type: 'array',
    of: [{ type: 'reference', to: [{ type: 'product' }] }],
}