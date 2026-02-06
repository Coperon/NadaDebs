import { DocumentIcon, TagIcon } from '@sanity/icons'
import { IoMdAnalytics } from 'react-icons/io'
import { MdOutlineModeEditOutline } from "react-icons/md";
import { FaShopify } from "react-icons/fa";
import pluralize from 'pluralize-esm'
import ProductHiddenInput from '../src/components/inputs/ProductHidden'
import ShopifyDocumentStatus from '../src/components/media/ShopifyDocumentStatus'
import { getPriceRange } from '../src/utils/getPriceRange'
import categoryField from './fields/productCategory'
import objectsCategoryField from './fields/objectsCategory'
import furnitureCategoryField from './fields/furnitureCategory'
import productDescriptionField from './fields/productDescription'
import metaFieldsField from './fields/metaFields'
import relatedCraftsField from './fields/relatedCrafts'
import makingOfField from './fields/makingOf'
import relatedProductsField from './fields/relatedProducts'
// import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'

const GROUPS = [
    {
        name: 'editorial',
        title: 'Editorial',
        default: true,
        icon: MdOutlineModeEditOutline
    },
    {
        name: 'shopifySync',
        title: 'Shopify Sync',
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
        // orderRankField({ type: 'product', newItemPosition: 'before', hidden: true }),
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
            title: 'Featured Image',
            type: 'image',
            description: 'If set, this image will be used as the main product image instead of the one from Shopify.',
            group: 'editorial',
        },
        {
            name: 'secondaryImage',
            title: 'Secondary Image',
            description: 'If set, this image will appear when hovering over the main image and on the product page.',
            type: 'image',
            group: 'editorial',
        },
        {
            name: 'moreImages',
            title: 'More Images',
            description: 'Additional images to display on the product page.',
            type: 'array',
            of: [{ type: 'image' }],
            options: {
                layout: 'grid',
            },
            group: 'editorial',
        },
        {
            ...categoryField,
            group: 'editorial',
        },
        // {
        //     ...objectsCategoryField,
        //     group: 'editorial',
        //     hidden: ({ parent }) => parent?.category !== 'objects',
        // },
        {
            name: 'objectsCategory',
            title: 'Type',
            type: 'reference',
            to: [{ type: 'objectsCategory' }],
            group: 'editorial',
            hidden: ({ parent }) => parent?.category !== 'objects',
            options: {
                filter: '!defined(parentType)',
            },
        },
        {
            name: 'objectsSubtype',
            title: 'Subtype',
            type: 'reference',
            to: [{ type: 'objectsCategory' }],
            group: 'editorial',
            hidden: ({ parent }) => !parent?.objectsCategory,
            options: {
                filter: ({ parent }) => {
                    if (!parent?.objectsCategory) return false
                    return {
                    filter: 'parentType._ref == $parentRef',
                    params: { parentRef: parent.objectsCategory._ref }
                    }
                }
            }
        },
        // {
        //     ...furnitureCategoryField,
        //     group: 'editorial',
        //     hidden: ({ parent }) => parent?.category !== 'furniture',
        // },
        {
            name: 'furnitureCategory',
            title: 'Type',
            type: 'reference',
            to: [{ type: 'furnitureCategory' }],
            group: 'editorial',
            hidden: ({ parent }) => parent?.category !== 'furniture',
            options: {
                filter: '!defined(parentType)',
            },
        },
        {
            name: 'furnitureSubtype',
            title: 'Subtype',
            type: 'reference',
            to: [{ type: 'furnitureCategory' }],
            group: 'editorial',
            hidden: ({ parent }) => !parent?.furnitureCategory,
            options: {
                filter: ({ parent }) => {
                    if (!parent?.furnitureCategory) return false
                    return {
                    filter: 'parentType._ref == $parentRef',
                    params: { parentRef: parent.furnitureCategory._ref }
                    }
                }
            }
        },
        {
            ...productDescriptionField,
            group: 'editorial',
        },
        {
            ...metaFieldsField,
            group: 'editorial',
        },
        {
            ...relatedCraftsField,
            group: 'editorial',
        },
        {
            ...makingOfField,
            group: 'editorial',
        },
        {
            ...relatedProductsField,
            group: 'editorial',
        },
        {
            name: 'buyOptions',
            title: 'Buy / Inquire options',
            type: 'object',
            fields: [
                {
                    name: 'onlyInquire',
                    title: 'Only Inquire',
                    type: 'boolean',
                    description: 'If true, the product will only be available for inquiry',
                },
                {
                    name: 'hidePrice',
                    title: 'Hide Price',
                    type: 'boolean',
                    description: 'If true, the price will not be shown on the product page',
                    hidden: ({ parent }) => !parent?.onlyInquire,
                },
                {
                    name: 'inquireWhenOutOfStock',
                    title: 'Inquire when out of stock',
                    type: 'boolean',
                    description: 'If true, the product will be available for inquiry when out of stock',
                    hidden: ({ parent }) => parent?.onlyInquire,
                },
            ],
            group: 'editorial',
        },
        {
            name: 'isPersonalizable',
            title: 'Is Personalizable',
            description: 'This will add a "Personalize" button to the product page.',
            type: 'boolean',
            group: 'editorial',
        },
        {
            name: 'isFeatured',
            title: 'Is Featured',
            description: 'If true, the product will be displayed larger on the index page',
            type: 'boolean',
            group: 'editorial',
            hidden: true
        },
        {
            title: 'SEO',
            name: 'seo',
            type: 'seo',
            group: 'seo',
        },
    ],
    orderings: [
        // orderRankOrdering,
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
            featuredImage: 'featuredImage.asset.url',
            previewImage: 'store.previewImageUrl',
            priceRange: 'store.priceRange',
            status: 'store.status',
            displayTitle: 'title',
            title: 'store.title',
            variants: 'store.variants',
            buyOptions: 'buyOptions',
        },
        prepare(selection) {
            const { isDeleted, options, featuredImage, previewImage, priceRange, status, title, displayTitle, variants, buyOptions } = selection
            const optionCount = options?.length
            const variantCount = variants?.length

            let description = [
                variantCount > 1 ? pluralize('variant', variantCount, true) : 'No variants',
            ]

            let subtitle = buyOptions?.onlyInquire && buyOptions?.hidePrice ? '' : getPriceRange(priceRange)
            if (status !== 'active') {
                subtitle = '(Unavailable in Shopify)'
            }
            if (isDeleted) {
                subtitle = '(Deleted from Shopify)'
            }

            return {
                subtitle: [subtitle, ...description].filter(Boolean).join(' / '),
                title: displayTitle || title,
                media: (
                    <ShopifyDocumentStatus
                        isActive={status === 'active'}
                        isDeleted={isDeleted}
                        type="product"
                        image={featuredImage || previewImage}
                        title={title}
                    />
                ),
            }
        },
    },
}
