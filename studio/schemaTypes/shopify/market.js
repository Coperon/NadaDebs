export default {
  name: 'shopifyMarket',
  type: 'document',
  title: 'Shopify Market',
  fields: [
    {
      name: 'label',
      type: 'string',
      title: 'Market Label',
      description: 'Display name for this market (e.g. United States, France)'
    },
    {
      name: 'countryCode',
      type: 'string',
      title: 'Country Code',
      description: 'ISO country code (e.g. US, FR, ES)'
    },
    {
      name: 'currencyCode',
      type: 'string',
      title: 'Currency Code',
      description: 'ISO currency code (e.g. USD, EUR)'
    },
    {
      name: 'languageCode',
      type: 'string',
      title: 'Language Code',
      description: 'ISO language code (e.g. EN, FR)'
    },
    {
      name: 'isActive',
      type: 'boolean',
      title: 'Active?',
      initialValue: true
    }
  ]
}
