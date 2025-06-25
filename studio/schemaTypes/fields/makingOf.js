export default {
    name: 'makingOf',
    title: 'Making of',
    type: 'array',
    of: [{ 
        type: 'object',
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
        ],
        preview: {
            select: {
                media: 'image',
            },
            prepare({ media }) {
                return {
                    media: media,
                }
            }
        },
    }],
    options: {
        layout: 'grid',
    },
}