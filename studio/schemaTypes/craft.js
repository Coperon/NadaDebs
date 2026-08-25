import { RiProfileLine } from 'react-icons/ri'
import { IoMdAnalytics } from 'react-icons/io'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export default {
    name: 'craft',
    title: 'Craft',
    type: 'document',
    orderings: [orderRankOrdering],
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
        orderRankField({type: 'craft', newItemPosition: 'before', hidden: true}),
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
            name: 'description',
            title: 'Description',
            type: 'text',
            group: 'content',
        },
        {
            name: 'thumbnail',
            title: 'Thumbnail',
            type: 'object',
            description: 'Used on the Contemporary Crafts listing page. Optional video plays on hover.',
            group: 'content',
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
                    description:
                        'URL from a CDN (Google Cloud Storage, Vimeo Pro direct file link, etc.). The image will be used as poster, please ensure it has the same aspect ratio as the video for consistency.',
                },
            ],
        },
        {
            name: 'images',
            title: 'Images',
            description: 'Gallery for the craft detail page (horizontal scroll on large screens).',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'craftMedia',
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
                            description:
                                'URL from a CDN (Google Cloud Storage, Vimeo Pro direct file link, etc.). The image will be used as poster, please ensure it has the same aspect ratio as the video for consistency.',
                        },
                    ],
                    preview: {
                        select: {
                            media: 'image',
                        },
                        prepare(selection) {
                            const { media } = selection
                            return {
                                title: 'Media',
                                media,
                            }
                        },
                    },
                },
            ],
            options: {
                layout: 'grid',
            },
            group: 'content',
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
        },
    },
}
