import { RiProfileLine } from 'react-icons/ri'
import { IoMdAnalytics } from 'react-icons/io'
import contentGridField from './fields/contentGrid'
import relatedCraftsField from './fields/relatedCrafts'
import relatedProductsField from './fields/relatedProducts'
import { slugify, validateSlug } from './fields/slugRules'

export default {
    name: 'collection',
    title: 'Collection',
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
            validation: validateSlug,
            options: {
                source: 'title',
                slugify,
            },
            group: 'content',
        },
        {
            name: 'year',
            title: 'Year',
            type: 'number',
            validation: (Rule) => Rule.required(),
            group: 'content',
        },
        {
            name: 'cover',
            title: 'Cover',
            type: 'image',
            group: 'content',
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'thumbnail',
            title: 'Thumbnail',
            type: 'image',
            group: 'content',
            description: 'If left empty, the cover image will be used.',
        },
        {
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags',
            },
            group: 'content',
        },
        {
            name: 'aboutTheCollection',
            title: 'About the Collection',
            type: 'text',
            group: 'content',
        },
        {
            name: 'lifestyleImages',
            title: 'Lifestyle Images',
            type: 'array',
            of: [{ 
                type: 'image',
                fields: [
                    {
                        name: 'caption',
                        title: 'Caption',
                        type: 'string',
                    },
                ],
            }],
            options: {
                layout: 'grid',
            },
            group: 'content',
            validation: (Rule) => Rule.max(3),
        },
        {
            name: 'featuredText',
            title: 'Featured Text',
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
            }],
            group: 'content',
        },
        {
            ...contentGridField,
            name: 'imagesGrid',
            title: 'Images Grid',
            group: 'content',
        },
        {
            ...relatedCraftsField,
            group: 'content',
        },
        {
            ...relatedProductsField,
            title: 'Products',
            group: 'content',
        },
        {
            title: 'SEO',
            name: 'seo',
            type: 'seo',
            group: 'seo',
        },
    ],
}
