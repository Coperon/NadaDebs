import { RiProfileLine } from 'react-icons/ri'
import { IoMdAnalytics } from 'react-icons/io'

export default {
    name: 'about',
    title: 'About',
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
            hidden: true,
            validation: (Rule) => Rule.required(),
            group: 'page',
        },
        {
            title: 'Hero',
            name: 'hero',
            type: 'object',
            group: 'page',
            validation: (Rule) => Rule.required(),
            fields: [
                {
                    title: 'Title',
                    name: 'title',
                    type: 'string',
                    validation: (Rule) => Rule.required(),
                },
                {
                    title: 'Description',
                    name: 'description',
                    type: 'text',
                    rows: 4,
                    validation: (Rule) => Rule.required(),
                },
                {
                    title: 'Image',
                    name: 'image',
                    type: 'image',
                    validation: (Rule) => Rule.required(),
                },
                {
                    title: 'Video URL',
                    name: 'video',
                    type: 'url',
                    description: 'URL from a CDN (Google Cloud Storage, Vimeo Pro direct file link, etc.). The image will be used as poster, please ensure it has the same aspect ratio as the video for consistency.',
                },
                {
                    title: 'Play Button Text',
                    name: 'playButtonText',
                    type: 'string',
                    validation: (Rule) => Rule.required(),
                }
            ]
        },
        {
            name: 'aboutNadaDebs',
            title: 'About Nada Debs',
            type: 'object',
            group: 'page',
            fields: [
                {
                    title: 'Title',
                    name: 'title',
                    type: 'string',
                },
                {
                    title: 'Text',
                    name: 'text',
                    type: 'array',
                    of: [{ 
                        type: 'block',
                        lists: [],
                        styles: [],
                        marks: {
                            decorators: [],
                            annotations: [],
                        }
                    }],
                    validation: (Rule) => Rule.required(),
                }
            ]
        },
        {
            name: 'handmadeHeartmade',
            title: 'Handmade / Heartmade',
            type: 'object',
            group: 'page',
            fields: [
                {
                    title: 'Title',
                    name: 'title',
                    type: 'string',
                },
                {
                    title: 'Handmade',
                    name: 'handmade',
                    type: 'text',
                    validation: (Rule) => Rule.required(),
                },
                {
                    title: 'Heartmade',
                    name: 'heartmade',
                    type: 'text',
                    validation: (Rule) => Rule.required(),
                }
            ]
        },
        {
            name: 'aboutStudio',
            title: 'About Studio Nada Debs',
            type: 'object',
            group: 'page',
            fields: [
                {
                    title: 'Title',
                    name: 'title',
                    type: 'string',
                },
                {
                    title: 'Text',
                    name: 'text',
                    type: 'array',
                    of: [{ 
                        type: 'block',
                        lists: [],
                        styles: [],
                        marks: {
                            decorators: [],
                            annotations: [],
                        }
                    }],
                    validation: (Rule) => Rule.required(),
                }
            ]
        },
        {
            name: 'services',
            title: 'Studio Services',
            type: 'object',
            group: 'page',
            fields: [
                {
                    title: 'Title',
                    name: 'title',
                    type: 'string',
                },
                {
                    title: 'Text',
                    name: 'text',
                    type: 'array',
                    of: [{ 
                        type: 'block',
                        lists: [],
                        styles: [],
                        marks: {
                            decorators: [],
                            annotations: [],
                        }
                    }],
                    validation: (Rule) => Rule.required(),
                },
                {
                    title: 'Services',
                    name: 'services',
                    type: 'array',
                    of: [{ type: 'object', fields: [
                        {
                            title: 'Title',
                            name: 'title',
                            type: 'string',
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            title: 'Continuation Text',
                            name: 'continuationText',
                            type: 'string'
                        },
                        {
                            title: 'Image',
                            name: 'image',
                            type: 'image',
                            validation: (Rule) => Rule.required(),
                        },
                    ] }],
                    validation: (Rule) => Rule.required(),
                }
            ]
        },
        {
            name: 'seo',
            title: 'SEO',
            type: 'seo',
            group: 'seo',
        }
    ],
}
