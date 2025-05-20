import {RiProfileLine} from 'react-icons/ri'
import {IoMdAnalytics} from 'react-icons/io'

export default {
    name: 'bespoke',
    title: 'Bespoke',
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
            name: 'featuredImage',
            title: 'Featured Image',
            type: 'image',
            group: 'page',
        },
        {
            name: 'sections',
            title: 'Categories',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    {
                        name: 'title',
                        title: 'Title',
                        type: 'string',
                    },
                    {
                        name: 'highlightedText',
                        title: 'Highlighted Text',
                        type: 'array',
                        of: [{
                            type: 'block',
                            styles: [],
                            lists: [],
                            marks: {
                                decorators: [
                                    {title: 'Strong', value: 'strong'},
                                ],
                                annotations: []
                            }
                        }]
                    },
                    {
                        name: 'images',
                        title: 'Images',
                        type: 'array',
                        of: [{type: 'image'}],
                        options: {
                            layout: 'grid',
                        },
                    }
                ],
                preview: {
                    select: {
                        title: 'title',
                        images: 'images',
                    },
                    prepare({title, images}) {
                        return {
                            title,
                            media: images && images[0] && images[0].asset ? images[0] : undefined,
                        }
                    }
                },
            }],
            group: 'page',
        },
        {
            title: 'SEO',
            name: 'seo',
            type: 'seo',
            group: 'seo',
        },
    ],
}

