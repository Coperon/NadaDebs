import {RiProfileLine} from 'react-icons/ri'
import {IoMdAnalytics} from 'react-icons/io'
import {StarIcon} from '@sanity/icons'

export default {
    name: 'awards',
    title: 'Awards',
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
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            group: 'page',
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'awards',
            title: 'Awards',
            type: 'array',
            group: 'page',
            of: [
                {
                    name: 'award',
                    title: 'Award',
                    type: 'object',
                    fields: [
                        {
                            name: 'title',
                            title: 'Title',
                            type: 'string',
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: 'subtitle',
                            title: 'Subtitle',
                            type: 'string',
                        },
                        {
                            name: 'year',
                            title: 'Year',
                            type: 'number',
                            validation: (Rule) => Rule.required(),
                        },
                    ],
                    preview: {
                        select: {
                            title: 'title',
                            year: 'year',
                        },
                        prepare({title, year}) {
                            return {
                                title: title,
                                subtitle: year,
                                media: StarIcon,
                            }
                        }
                    }
                }
            ],
        },
        {
            name: 'seo',
            title: 'SEO',
            type: 'seo',
            group: 'seo',
        }
    ],
}

