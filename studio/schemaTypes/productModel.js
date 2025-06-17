import { TagIcon } from '@sanity/icons'
import productDescriptionField from './fields/productDescription'
import metaFieldsField from './fields/metaFields'
import relatedCraftsField from './fields/relatedCrafts'
import makingOfField from './fields/makingOf'
import relatedProductsField from './fields/relatedProducts'

export default {
    name: 'productModel',
    title: 'Product Model',
    type: 'document',
    icon: TagIcon,
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'optionsLabel',
            title: 'Label for options',
            type: 'string',
            description: 'Color, pattern, etc. Default: Options',
        },
        {
            name: 'products',
            title: 'Products',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    { 
                        name: 'product',
                        title: 'Product',
                        type: 'reference', 
                        to: [{ type: 'product' }],
                        validation: (Rule) => Rule.required(),
                    },
                    {
                        name: 'optionName',
                        title: 'Option name',
                        type: 'string',
                        validation: (Rule) => Rule.required(),
                    },
                    {
                        name: 'swatch',
                        title: 'Swatch',
                        type: 'image',
                        validation: (Rule) => Rule.required(),
                    },
                ],
                preview: {
                    select: {
                        title: 'product.store.title',
                        media: 'swatch',
                    },
                },
            }],
        },
        {
            name: 'images',
            title: 'Images',
            type: 'array',
            of: [{ type: 'image' }],
            options: {
                layout: 'grid',
            },
            description: 'Will be displayed after the image(s) of each product of this model.',
        },
        {
            ...productDescriptionField,
        },
        {
            ...metaFieldsField,
        },
        {
            ...relatedCraftsField,
        },
        {
            ...makingOfField,
        },
    ]
}