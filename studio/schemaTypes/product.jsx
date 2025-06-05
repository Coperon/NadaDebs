import { DocumentIcon, TagIcon } from '@sanity/icons'
import { IoMdAnalytics } from 'react-icons/io'
import { MdOutlineModeEditOutline } from "react-icons/md";
import { FaShopify } from "react-icons/fa";
import pluralize from 'pluralize-esm'
import ProductHiddenInput from '../src/components/inputs/ProductHidden'
import ShopifyDocumentStatus from '../src/components/media/ShopifyDocumentStatus'
import { getPriceRange } from '../src/utils/getPriceRange'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'

const GROUPS = [
    {
        name: 'editorial',
        title: 'Editorial',
        default: true,
        icon: MdOutlineModeEditOutline
    },
    {
        name: 'shopifySync',
        title: 'Shopify sync',
        icon: FaShopify,
    },
    {
        name: 'seo',
        title: 'SEO',
        icon: IoMdAnalytics,
    },
]

export default {
    name: 'product',
    title: 'Product',
    type: 'document',
    icon: TagIcon,
    groups: GROUPS,
    fields: [
        orderRankField({ type: 'product', newItemPosition: 'before', hidden: true }),
        {
            name: 'hidden',
            type: 'string',
            components: {
                field: ProductHiddenInput,
            },
            group: GROUPS.map((group) => group.name),
            hidden: ({ parent }) => {
                const isActive = parent?.store?.status === 'active'
                const isDeleted = parent?.store?.isDeleted
                return !parent?.store || (isActive && !isDeleted)
            },
        },
        // Title (proxy)
        {
            name: 'titleProxy',
            title: 'Title',
            type: 'proxyString',
            options: { field: 'store.title' },
        },
        // Slug (proxy)
        {
            name: 'slugProxy',
            title: 'Slug',
            type: 'proxyString',
            options: { field: 'store.slug.current' },
        },
        // Color theme
        //   {
        //     name: 'colorTheme',
        //     title: 'Color theme',
        //     type: 'reference',
        //     to: [{type: 'colorTheme'}],
        //     group: 'editorial',
        //   },
        {
            name: 'store',
            title: 'Shopify',
            type: 'shopifyProduct',
            description: 'Product data from Shopify (read-only)',
            group: 'shopifySync',
        },
        // {
        //   name: 'title',
        //   title: 'Title',
        //   type: 'string',
        //   group: 'editorial',
        //   description: 'If filled, it will override the title from Shopify',
        // },
        {
            name: 'featuredImage',
            title: 'FeaturedImage',
            type: 'image',
            validation: (Rule) => Rule.required(),
            options: {
                hotspot: true,
            },
            group: 'editorial',
            description: 'If filled, it will override the featured image from Shopify',
        },
        {
            name: 'body',
            title: 'Body',
            type: 'textContent',
            group: 'editorial',
        },
        {
            title: 'SEO',
            name: 'seo',
            type: 'seo',
            group: 'seo',
        },
    ],
    orderings: [
        orderRankOrdering,
        {
            name: 'titleAsc',
            title: 'Title (A-Z)',
            by: [{ field: 'store.title', direction: 'asc' }],
        },
        {
            name: 'titleDesc',
            title: 'Title (Z-A)',
            by: [{ field: 'store.title', direction: 'desc' }],
        },
        {
            name: 'priceDesc',
            title: 'Price (Highest first)',
            by: [{ field: 'store.priceRange.minVariantPrice', direction: 'desc' }],
        },
        {
            name: 'priceAsc',
            title: 'Price (Lowest first)',
            by: [{ field: 'store.priceRange.minVariantPrice', direction: 'asc' }],
        },
    ],
    preview: {
        select: {
            isDeleted: 'store.isDeleted',
            options: 'store.options',
            previewImage: 'featuredImage.asset.url',
            priceRange: 'store.priceRange',
            status: 'store.status',
            displayTitle: 'title',
            title: 'store.title',
            variants: 'store.variants',
        },
        prepare(selection) {
            const { isDeleted, options, previewImage, priceRange, status, title, displayTitle, variants } = selection
            const optionCount = options?.length
            const variantCount = variants?.length

            let description = [
                variantCount ? pluralize('variant', variantCount, true) : 'No variants',
                optionCount ? pluralize('option', optionCount, true) : 'No options',
            ]

            let subtitle = getPriceRange(priceRange)
            if (status !== 'active') {
                subtitle = '(Unavailable in Shopify)'
            }
            if (isDeleted) {
                subtitle = '(Deleted from Shopify)'
            }

            return {
                description: description.join(' / '),
                subtitle,
                title: displayTitle || title,
                media: (
                    <ShopifyDocumentStatus
                        isActive={status === 'active'}
                        isDeleted={isDeleted}
                        type="product"
                        image={previewImage}
                        title={title}
                    />
                ),
            }
        },
    },
}
