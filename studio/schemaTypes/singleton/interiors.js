import {RiProfileLine} from 'react-icons/ri'
import {IoMdAnalytics} from 'react-icons/io'

export default {
    name: 'interiors',
    title: 'Interiors',
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
            name: 'title',
            title: 'Title',
            type: 'string',
            group: 'page',
            hidden: true,
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
            group: 'page',
            validation: (Rule) => Rule.required(),
        },
        
    ],
}

