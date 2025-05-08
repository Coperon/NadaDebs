import {RiProfileLine} from 'react-icons/ri'
import {IoMdAnalytics} from 'react-icons/io'

export default {
  name: 'shopArchive',
  title: 'Shop Archive',
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
      group: 'page',
      description:
        'This is Projects Archive page. It will display all the projects in the archive.',
    },
    // {
    //   name: 'slug',
    //   title: 'Slug',
    //   type: 'slug',
    //   description:
    //     'The slug for the project, it must be unique. Click on "Generate" to create a slug automatically based on the title.',
    //   validation: (Rule) => Rule.required(),
    //   options: {
    //     source: 'title',
    //   },
    //   group: 'page',
    //   initialValue: 'shop',
    //   hidden: true,
    // },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    },
  ],
}
