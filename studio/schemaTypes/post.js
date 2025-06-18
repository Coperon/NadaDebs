import { RiProfileLine } from 'react-icons/ri'
import { IoMdAnalytics } from 'react-icons/io'
import contentGridField from './fields/contentGrid'

export default {
    name: 'post',
    title: 'Post',
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
            name: 'thumbnail',
            title: 'Thumbnail',
            type: 'image',
            group: 'content',
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'cover',
            title: 'Cover',
            type: 'image',
            group: 'content',
        },
        {
            name: 'date',
            title: 'Month & Year',
            type: 'date',
            group: 'content',
            validation: (Rule) => Rule.required(),
            options: {
                dateFormat: 'MMM YYYY',
            },
        },
        {
            name: 'text',
            title: 'Text',
            type: 'text',
            group: 'content',
            validation: (Rule) => Rule.required(),
        },
        {
            ...contentGridField,
            name: 'content',
            title: 'Content',
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
    // preview: {
    //     select: {
    //         title: 'title',
    //         media: 'thumbnail.image',
    //     },
    //     prepare({ title, media }) {
    //         return { title, media }
    //     }
    // }
}
