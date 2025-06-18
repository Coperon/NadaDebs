import {TextIcon} from '@sanity/icons'
import {ImageIcon} from '@sanity/icons'

export default {
    type: 'array',
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
        }
    ]
}