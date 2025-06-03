import {RiProfileLine} from 'react-icons/ri'
import {IoMdAnalytics} from 'react-icons/io'

export default {
    name: 'workWithUs',
    title: 'Work with us',
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
            hidden: false,
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
            name: 'openPositions',
            title: 'Open Positions',
            type: 'object',
            fields: [
                {
                    name: 'description',
                    title: 'Description',
                    type: 'text',
                    rows: 4,
                    validation: (Rule) => Rule.required(),
                },
                {
                    name: 'emptyDescription',
                    title: 'Description when no positions are open',
                    type: 'text',
                    rows: 4,
                    validation: (Rule) => Rule.required(),
                },
                {
                    name: 'applyLink',
                    title: 'Apply Spontaneously Link',
                    type: 'url',
                }
            ],
            group: 'page',
        },
        {
            name: 'aboutTheCompany',
            title: 'About the Company',
            type: 'object',
            fields: [
                {
                    name: 'description',
                    title: 'Description',
                    type: 'text',
                    rows: 4,
                    validation: (Rule) => Rule.required(),
                },
                {
                    name: 'images',
                    title: 'Images',
                    type: 'array',
                    of: [{ type: 'image' }],
                    options: {
                        layout: 'grid',
                    },
                    validation: (Rule) => Rule.max(10),
                }
            ],
            group: 'page',
        },
        {
            name: 'team',
            title: 'Team',
            type: 'array',
            of: [
                {
                    name: 'person',
                    title: 'Person',
                    type: 'object',
                    fields: [
                        {
                            name: 'name',
                            title: 'Name',
                            type: 'string',
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: 'role',
                            title: 'Role',
                            type: 'string',
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: 'image',
                            title: 'Image',
                            type: 'image',
                            validation: (Rule) => Rule.required(),
                        },
                    ]
                }
            ],
            group: 'page',
        },
        {
            name: 'seo',
            title: 'SEO',
            type: 'seo',
            group: 'seo',
        }
    ],
}