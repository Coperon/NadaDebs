import {RiProfileLine} from 'react-icons/ri'
import {IoMdAnalytics} from 'react-icons/io'

export default {
    name: 'press',
    title: 'Press',
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
            name: 'articles',
            title: 'Articles',
            type: 'array',
            group: 'page',
            validation: (Rule) => Rule.required(),
            of: [
                {
                    name: 'article',
                    title: 'Article',
                    type: 'object',
                    fields: [
                        {
                            name: 'date',
                            title: 'Month & Year',
                            type: 'date',
                            options: {
                                dateFormat: 'MMM YYYY',
                            },
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: 'image',
                            title: 'Image',
                            type: 'image',
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: 'type',
                            title: 'PDF or Link?',
                            type: 'string',
                            options: {
                                list: [
                                    {title: 'PDF', value: 'pdf'},
                                    {title: 'Link', value: 'link'},
                                ],
                            },
                            initialValue: 'pdf',
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: 'link',
                            title: 'Link',
                            type: 'url',
                            hidden: ({parent}) => parent.type === 'pdf',
                        },
                        {
                            name: 'pdf',
                            title: 'PDF',
                            type: 'file',
                            hidden: ({parent}) => parent.type === 'link',
                        }
                    ],
                    preview: {
                        select: {
                            title: 'date',
                            subtitle: 'type',
                            media: 'image',
                        },
                        prepare({title, subtitle, media}) {
                            const date = new Date(title)
                            const formattedDate = date.toLocaleDateString('en-US', {
                                month: 'short',
                                year: 'numeric'
                            })
                            const typeTitles = {
                                pdf: 'PDF',
                                link: 'Link'
                            }
                            return {
                                title: formattedDate,
                                subtitle: typeTitles[subtitle] || subtitle,
                                media
                            }
                        }
                    },
                },
            ]
        }
    ],
}

