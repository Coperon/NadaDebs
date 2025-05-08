export default {
  name: 'seo',
  title: 'SEO',
  type: 'document',
  fields: [
    {
      title: 'Meta Title',
      name: 'ogtitle',
      type: 'string',
      description: 'Title to be displayed in search results and social shares.',
    },
    {
      title: 'Meta Description',
      name: 'ogdescription',
      type: 'text',
      validation: (Rule) => Rule.max(160),
      description:
        'Description to be displayed in search results and social shares. It should be 160 characters max.',
      rows: 3,
    },
    {
      title: 'Meta Image',
      name: 'ogimage',
      type: 'image',
      validation: null,
      description: 'Image to be displayed in search engine results and social shares.',
    },
  ],
}
