import { RiProfileLine } from 'react-icons/ri'
import { IoMdAnalytics } from 'react-icons/io'

export default {
    name: 'position',
    title: 'Position',
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
            name: 'position',
            title: 'Position',
            type: 'string',
            validation: (Rule) => Rule.required(),
            group: 'content',
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            description:
                'The slug for the page, it must be unique. Click on "Generate" to create a slug automatically based on the position.',
            validation: (Rule) => Rule.required(),
            options: {
                source: 'position',
            },
            group: 'content',
        },
        {
            name: 'location',
            title: 'Location',
            type: 'string',
            group: 'content',
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'experience',
            title: 'Experience',
            type: 'string',
            description: 'Junior, Mid, Senior...',
            group: 'content',
        },
        {
            name: 'type',
            title: 'Type',
            type: 'string',
            description: 'Full-time, Part-time, Internship...',
            group: 'content',
        },
        {
            name: 'openUntil',
            title: 'Open Until (Month & Year)',
            type: 'date',
            group: 'content',
            options: {
                dateFormat: 'MMM YYYY',
            },
        },
        {
            name: 'aboutThePosition',
            title: 'About the Position',
            type: 'array',
            of: [{ 
                type: 'block',
                styles: [
                    { title: 'Heading', value: 'h2' },
                ],
                marks: {
                    decorators: [
                        { title: 'Strong', value: 'strong' },
                        { title: 'Emphasis', value: 'em' },
                    ],
                },
            }],
            group: 'content',
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            group: 'content',
            validation: (Rule) => Rule.required(),
        },
        {
            title: 'SEO',
            name: 'seo',
            type: 'seo',
            group: 'seo',
        },
    ],
}
