export default {
  name: 'gallery',
  type: 'object',
  title: 'Gallery',
  fields: [
    {
      name: 'images',
      type: 'array',
      title: 'Images',
      of: [
        {
          name: 'image',
          type: 'image',
          title: 'Image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            },
          ],
        },
      ],
      options: {
        layout: 'grid',
      },
    },
    {
      title: 'Allow lightbox?',
      name: 'allowLightbox',
      type: 'boolean',
      description: 'Allow lightbox to display images in full screen on click.',
      initialValue: false,
    },
    {
      name: 'caption',
      title: 'Caption',
      type: 'textContent',
    },
  ],
  preview: {
    select: {
      images: 'images',
    },
    prepare(selection) {
      const {images} = selection
      return {
        title: `Gallery`, // Use .length directly on the array
        media: images && images.length > 0 ? images[0] : [],
      }
    },
  },
}
