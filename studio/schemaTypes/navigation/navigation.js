import {GrNavigate} from 'react-icons/gr'

export default {
  name: 'navigation',
  title: 'Navigation menus',
  type: 'document',
  icon: GrNavigate,
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
    },
    // Uncomment if you need a specific unique reference to the navigation menus to be used to query data
    // {
    //   name: 'navId',
    //   type: 'slug',
    //   title: "Navigation Id",
    //   description: "Click to generate to create a unique ID for the nav menu",
    //   validation: Rule => Rule.required(),
    //   options: {
    //       source: 'title'
    //   }
    // },
    {
      name: 'items',
      type: 'array',
      title: 'Navigation items',
      of: [{type: 'navigationItem'}],
    },
  ],
}
