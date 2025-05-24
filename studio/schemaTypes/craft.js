import { RiProfileLine } from 'react-icons/ri'
import { IoMdAnalytics } from 'react-icons/io'
import {TextIcon} from '@sanity/icons'
import {ImageIcon} from '@sanity/icons'

export default {
    name: 'craft',
    title: 'Craft',
    type: 'document',
    groups: [
        {
            name: 'content',
            title: 'Content',
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
        {
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
            group: 'content',
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            description:
                'The slug for the page, it must be unique. Click on "Generate" to create a slug automatically based on the title.',
            validation: (Rule) => Rule.required(),
            options: {
                source: 'title',
            },
            group: 'content',
        },
        {
            name: 'briefDescription',
            title: 'Brief description (for thumbnail)',
            type: 'string',
            validation: (Rule) => Rule.required(),
            group: 'content',
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
            group: 'content',
        },
        {
            name: 'thumbnail',
            title: 'Thumbnail',
            type: 'object',
            group: 'content',
            validation: (Rule) => Rule.required(),
            fields: [
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
            ]
        },
        {
            name: 'cover',
            title: 'Cover',
            type: 'image',
            group: 'content',
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'content',
            title: 'Content',
            type: 'array',
            group: 'content',
            validation: (Rule) => Rule.required(),
            of: [
                {
                    name: 'contentMedia',
                    title: 'Image or Video',
                    type: 'object',
                    icon: ImageIcon,
                    preview: {
                        select: {
                            size: 'size',
                            media: 'image'
                        },
                        prepare({ size, media }) {
                            const sizeTitles = {
                                '1x1': 'Square',
                                '2x1': 'Landscape',
                                '1x2': 'Portrait'
                            }
                            return {
                                title: sizeTitles[size] || size,
                                media: media
                            }
                        }
                    },
                    fields: [
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
                            title: 'Format',
                            name: 'size',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Square', value: '1x1' },
                                    { title: 'Landscape', value: '2x1' },
                                    { title: 'Portrait', value: '1x2' }
                                ],
                                layout: 'radio',
                                direction: 'horizontal',
                            },
                            initialValue: '1x1',
                            validation: (Rule) => Rule.required(),
                        }
                    ]
                },
                {
                    name: 'contentText',
                    title: 'Text',
                    type: 'object',
                    icon: TextIcon,
                    preview: {
                        select: {
                            size: 'size',
                        },
                        prepare({ size }) {
                            const sizeTitles = {
                                '1x1': 'Square',
                                '2x1': 'Landscape',
                                '1x2': 'Portrait'
                            }
                            return {
                                title: sizeTitles[size] || size,
                            }
                        }
                    },
                    fields: [
                        {
                            name: 'text',
                            title: 'Text',
                            type: 'array',
                            validation: (Rule) => Rule.required(),
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
                            title: 'Format',
                            name: 'size',
                            type: 'string',
                            options: {
                                list: [
                                    { title: '1x1', value: '1x1' },
                                    { title: '2x1', value: '2x1' },
                                    { title: '1x2', value: '1x2' }
                                ],
                                layout: 'radio',
                                direction: 'horizontal',
                            },
                            initialValue: '1x1',
                            validation: (Rule) => Rule.required(),
                        }
                    ]
                }
            ]
        },
        {
            title: 'SEO',
            name: 'seo',
            type: 'seo',
            group: 'seo',
        },
    ],
    preview: {
        select: {
            title: 'title',
            media: 'thumbnail.image',
        },
        prepare({ title, media }) {
            return { title, media }
        }
    }
}
