import {TagIcon} from '@sanity/icons'

export default {
  name: 'objectsCategory',
  title: 'Objects Category',
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
        'The slug must be unique. Click on "Generate" to create a slug automatically based on the title.',
    },
    {
      name: 'parentType',
      title: 'Parent Type',
      type: 'reference',
      to: [{ type: 'objectsCategory' }],
      description: 'Optional. Leave empty for main types, or select a parent to create a subtype.',
      validation: (Rule) => Rule.custom((value, context) => {
        // Prevent self-reference
        if (value && value._ref === context.document._id) {
          return 'A type cannot be its own parent'
        }
        return true
      }),
      options: {
        filter: '!defined(parentType)',
      },
    },
  ],
}
