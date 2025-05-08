import {RiProfileLine} from 'react-icons/ri'
import {IoMdAnalytics} from 'react-icons/io'

export default {
  name: 'page',
  title: 'Page',
  type: 'document',
  groups: [
    {
      name: 'page',
      title: 'Page',
      options: {
        collapsible: true,
        collapsed: false,
      },
      default: true,
      icon: RiProfileLine,
    },
    {
      name: 'seo',
      title: 'SEO',
      options: {
        collapsible: true,
        collapsed: false,
      },
      icon: IoMdAnalytics,
    },
  ],
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'page',
    },
    {
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      description:
        'The slug for the page, it must be unique. Click on "Generate" to create a slug automatically based on the title.',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
      },
      group: 'page',
    },
    {
      title: 'Main Content',
      name: 'content',
      type: 'blockContent',
      group: 'page',
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    },
  ],
}
