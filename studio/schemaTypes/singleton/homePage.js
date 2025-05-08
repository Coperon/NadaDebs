import {RiProfileLine} from 'react-icons/ri'
import {IoMdAnalytics} from 'react-icons/io'

export default {
  name: 'homepage',
  title: 'Homepage',
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
    },
    {
      title: 'Main content - Portable Text',
      name: 'content',
      type: 'blockContent',
      group: 'page',
    },
    {
      title: 'Main content - Page Builder',
      name: 'pageBuilder',
      type: 'pageBuilder',
      group: 'page',
      description: 'This is the main content of the page. It works as a flexible page builder, you can add block types like text, media, and galleries. using the "Add item" button.',
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    },
  ],
}
