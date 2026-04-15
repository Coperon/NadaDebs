import {RiProfileLine} from 'react-icons/ri'
import {IoMdAnalytics} from 'react-icons/io'

export default {
    name: 'collections',
    title: 'Collections',
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
            name: 'collectionOrder',
            title: 'Collections',
            type: 'array',
            description: 'Add and reorder collections to display on this page. Only collections in this list will be shown. Drag using the handler to reorder. If you can\'t find a collection, it might be already in the list.',
            group: 'page',
            of: [
                {
                    type: 'reference',
                    to: [{ type: 'collection' }],
                    options: {
                        filter: ({ parent }) => {
                            const selectedIds = parent
                                .filter((item) => item?._ref)
                                .map((item) => item._ref)
                            return {
                                filter: '!(_id in $selectedIds)',
                                params: { selectedIds },
                            }
                        },
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

