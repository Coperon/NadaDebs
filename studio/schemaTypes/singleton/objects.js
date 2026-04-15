import {RiProfileLine} from 'react-icons/ri'
import {IoMdAnalytics} from 'react-icons/io'

export default {
    name: 'objects',
    title: 'Objects',
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
            name: 'title',
            title: 'Title',
            type: 'string',
            group: 'page',
            hidden: true,
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
            group: 'page',
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'productOrder',
            title: 'Products',
            type: 'array',
            description: 'Add and reorder products to display on this page. Only products in this list will be shown. Drag using the handler to reorder. If you can\'t find a product, it might be already in the list.',
            group: 'page',
            of: [
                {
                    type: 'reference',
                    to: [{ type: 'product' }],
                    options: {
                        filter: ({ document }) => {
                            const productOrder = document?.productOrder || []
                            const selectedRefs = productOrder.map((item) => item._ref).filter(Boolean)
                            if (selectedRefs.length === 0) {
                                return 'category == "objects"'
                            }
                            return {
                                filter: 'category == "objects" && !(_id in $selectedRefs)',
                                params: { selectedRefs },
                            }
                        }
                    },
                },
            ],
        },
        {
            name: 'seo',
            title: 'SEO',
            type: 'seo',
            group: 'seo',
        }
    ],
}

