export default {
    name: 'contact',
    title: 'Contact',
    type: 'document',
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
        description:
          'The slug for the page, it must be unique. Click on "Generate" to create a slug automatically based on the title.',
        validation: (Rule) => Rule.required(),
        options: {
          source: 'title',
        },
      },
      {
        name: 'content',
        title: 'Main content',
        type: 'blockContent',
      },
    ],
  }
  