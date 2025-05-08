export default {
  name: 'media',
  title: 'Media',
  type: 'image',
  validation: (Rule) => [
    Rule.custom((value) => {
      return value && value.asset
        ? true
        : {
            message: 'An Image is Required!',
          };
    }),
  ],
  fields: [
    {
      name: 'caption',
      title: 'Caption',
      type: 'textContent',
      description: 'Short description to be displayed below the image or video',
    },
    {
      name: 'videoUrl',
      title: 'Video url',
      type: 'url',
      description: 'Url from a cdn (Google Cloud Storage, Vimeo Pro direct file link, etc.). The image will be used as poster, please ensure it has the same aspect ratio as the video for consistency.',
    },
    {
      name: 'autoplay',
      title: 'Autoplay',
      type: 'boolean',
      hidden: ({parent}) => {
        return !parent?.videoUrl
      },
      initialValue: false,
      description: 'Starts playing automatically when the page loads.',
    },
  ],
  preview: {
    select: {
      imageUrl: 'asset', // Correctly select the image URL from the asset
      caption: 'caption',
    },
    prepare(selection) {
      const {imageUrl, caption} = selection
      return {
        title: 'Media',
        media: imageUrl,
      }
    },
  },
}
