import { RiProfileLine } from 'react-icons/ri'
import { IoMdAnalytics } from 'react-icons/io'
import contentGridField from './fields/contentGrid'

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
            // validation: (Rule) => Rule.required(),
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
            // validation: (Rule) => Rule.required(),
        },
        {
            ...contentGridField,
            name: 'content',
            title: 'Content',
            group: 'content',
            // validation: (Rule) => Rule.required(),
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
