import {TagIcon} from '@sanity/icons'

export default {
  name: 'category',
  title: 'Categories',
  type: 'document',
  icon: TagIcon,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
      },
      description:
        'The slug for the category, it must be unique. Click on "Generate" to create a slug automatically based on the title.',
    },
  ],
}
