export default {
    name: 'crafts',
    title: 'Crafts',
    type: 'array',
    of: [{ type: 'reference', to: [{ type: 'craft' }] }],
}