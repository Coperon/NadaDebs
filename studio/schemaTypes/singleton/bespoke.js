import {RiProfileLine} from 'react-icons/ri'
import {IoMdAnalytics} from 'react-icons/io'
import relatedProductsField from '../fields/relatedProducts'

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
                        of: [
                            {
                                type: 'object',
                                name: 'bespokeMedia',
                                title: 'Media',
                                fields: [
                                    {
                                        name: 'image',
                                        title: 'Image',
                                        type: 'image',
                                        validation: (Rule) => Rule.required(),
                                    },
                                    {
                                        name: 'video',
                                        title: 'Video',
                                        type: 'url',
                                        description: 'URL from a CDN (Google Cloud Storage, Vimeo Pro direct file link, etc.). The image will be used as poster, please ensure it has the same aspect ratio as the video for consistency.',
                                    },
                                ],
                                preview: {
                                    select: {
                                        media: 'image',
                                    },
                                    prepare(selection) {
                                        const {media} = selection
                                        return {
                                            title: 'Media',
                                            media: media,
                                        }
                                    }
                                }
                            }
                        ],
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
                            media: images && images[0] && images[0].image ? images[0].image : undefined,
                        }
                    }
                },
            }],
            group: 'page',
        },
        {
            ...relatedProductsField,
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

