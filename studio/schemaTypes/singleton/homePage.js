import { RiProfileLine } from 'react-icons/ri'
import { IoMdAnalytics } from 'react-icons/io'

export default {
    name: 'homepage',
    title: 'Homepage',
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
            title: 'Title',
            name: 'title',
            type: 'string',
            group: 'page',
        },
        {
            title: 'Our World',
            name: 'ourWorld',
            type: 'object',
            group: 'page',
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
                {
                    title: 'Mobile Image',
                    name: 'mobileImage',
                    type: 'image',
                },
                {
                    title: 'Mobile Video URL',
                    name: 'mobileVideo',
                    type: 'url',
                    description: 'URL from a CDN (Google Cloud Storage, Vimeo Pro direct file link, etc.). The image will be used as poster, please ensure it has the same aspect ratio as the video for consistency.',
                },
            ]
        },
        {
            title: 'Shop',
            name: 'shop',
            type: 'object',
            group: 'page',
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
                    title: 'Mobile Image',
                    name: 'mobileImage',
                    type: 'image',
                },
                {
                    title: 'Mobile Video URL',
                    name: 'mobileVideo',
                    type: 'url',
                    description: 'URL from a CDN (Google Cloud Storage, Vimeo Pro direct file link, etc.). The image will be used as poster, please ensure it has the same aspect ratio as the video for consistency.',
                },
            ]
        },
        {
            title: 'Studio',
            name: 'studio',
            type: 'object',
            group: 'page',
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
                    title: 'Mobile Image',
                    name: 'mobileImage',
                    type: 'image',
                },
                {
                    title: 'Mobile Video URL',
                    name: 'mobileVideo',
                    type: 'url',
                    description: 'URL from a CDN (Google Cloud Storage, Vimeo Pro direct file link, etc.). The image will be used as poster, please ensure it has the same aspect ratio as the video for consistency.',
                },
            ]
        },
        {
            name: 'seo',
            title: 'SEO',
            type: 'seo',
            group: 'seo',
        },
    ],
}
