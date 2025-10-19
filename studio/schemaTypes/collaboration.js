import { RiProfileLine } from 'react-icons/ri'
import { IoMdAnalytics } from 'react-icons/io'

export default {
    name: 'collaboration',
    title: 'Collaboration',
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
            title: 'Collaborator',
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
            name: 'year',
            title: 'Year',
            type: 'number',
            validation: (Rule) => Rule.required(),
            group: 'content',
        },
        {
            name: 'images',
            title: 'Images',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'media',
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
            group: 'content',
        },
        {
            name: 'featuredImage',
            title: 'Featured Image',
            type: 'image',
            validation: (Rule) => Rule.required(),
            group: 'content'
        },
        {
            name: 'relatedCollaborations',
            title: 'Related Collaborations',
            type: 'array',
            of: [{ 
                type: 'reference', 
                to: [{ type: 'collaboration' }],
                options: {
                    disableNew: true,
                }
            }],
            group: 'content',
        },
        {
            name: 'isFeatured',
            title: 'Is Featured',
            description: 'If true, the project will be displayed larger on the collaborations page',
            type: 'boolean',
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
