import { at, defineMigration, set } from 'sanity/migrate'

export default defineMigration({
  title: 'Set inquireWhenOutOfStock to true for all products',
  documentTypes: ['product'],
  migrate: {
    document(doc) {
      return at('buyOptions', set({
        ...(doc.buyOptions && typeof doc.buyOptions === 'object' ? doc.buyOptions : {}),
        inquireWhenOutOfStock: true,
      }))
    },
  },
})
