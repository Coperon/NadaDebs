import {RiProfileLine} from 'react-icons/ri'
import {IoMdAnalytics} from 'react-icons/io'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  orderings: [orderRankOrdering],
  groups: [
    {
      name: 'project',
      title: 'Project',
      default: true,
      icon: RiProfileLine,
    },
    {
      name: 'seo',
      title: 'SEO',
      icon: IoMdAnalytics,
    },
  ],
  fields: [
    orderRankField({type: 'project', newItemPosition: 'before', hidden: true}),
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'project',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description:
        'The slug for the project, it must be unique. Click on "Generate" to create a slug automatically based on the title.',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
      },
      group: 'project',
    },
    {
      name: 'publishedAt',
      title: 'Date',
      type: 'datetime',
      description: 'The date when the article was published.',
      validation: (Rule) => Rule.required(),
      group: 'project',
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{
        type: 'reference', 
        to: {type: 'category'},
        options: {
          disableNew: true,
          filter: ({ parent, document }) => {
              const selectedRefs = parent
                  ? parent.map((item) => item._ref).filter((ref) => typeof ref === 'string')
                  : []

              return {
                  filter: '!(_id in $selectedRefs)',
                  params: { selectedRefs },
              }
          },
      },
      }],
      group: 'project',
    },
    {
      name: 'featuredImage',
      title: 'FeaturedImage',
      type: 'image',
      validation: (Rule) => Rule.required(),
      group: 'project',
      options: {
        hotspot: true,
      }
    },
    {
      name: 'content',
      title: 'Main content',
      type: 'blockContent',
      group: 'project',
    },
    {
      title: 'SEO',
      name: 'seo',
      type: 'seo',
      group: 'seo',
    },
  ],
}
