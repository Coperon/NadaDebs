import {CopyIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import {FaShopify} from 'react-icons/fa'
import {MdOutlineModeEditOutline} from 'react-icons/md'
import ProductVariantHiddenInput from '../src/components/inputs/ProductVariantHidden'
import ShopifyDocumentStatus from '../src/components/media/ShopifyDocumentStatus'
import metaFieldsField from './fields/metaFields'

export default defineType({
  name: 'productVariant',
  title: 'Product variant',
  type: 'document',
  icon: CopyIcon,
  groups: [
    {
      name: 'editorial',
      title: 'Editorial',
      icon: MdOutlineModeEditOutline,
      default: true,
    },
    {
      name: 'shopifySync',
      title: 'Shopify Sync',
      icon: FaShopify,
    },
  ],
  fields: [
    // Product variant hidden status
    defineField({
      name: 'hidden',
      type: 'string',
      components: {
        field: ProductVariantHiddenInput,
      },
      hidden: ({parent}) => {
        const isDeleted = parent?.store?.isDeleted

        return !isDeleted
      },
    }),
    // Title (proxy)
    defineField({
      title: 'Title',
      name: 'titleProxy',
      type: 'proxyString',
      options: {field: 'store.title'},
    }),
    // Shopify product variant
    defineField({
      name: 'store',
      title: 'Shopify',
      description: 'Variant data from Shopify (read-only)',
      type: 'shopifyProductVariant',
      group: 'shopifySync',
    }),
    // Meta fields (editorial)
    defineField({
      ...metaFieldsField,
      group: 'editorial',
    }),
    {
      name: 'images',
      title: 'Images',
      description: 'Additional images to display on the product page.',
      type: 'array',
      of: [{type: 'image'}],
      options: {
        layout: 'grid',
      },
      group: 'editorial',
      hidden: ({parent}) => parent?.store?.title === 'Default Title',
    },
  ],
  preview: {
    select: {
      isDeleted: 'store.isDeleted',
      previewImageUrl: 'store.previewImageUrl',
      sku: 'store.sku',
      status: 'store.status',
      title: 'store.title',
    },
    prepare(selection) {
      const {isDeleted, previewImageUrl, sku, status, title} = selection

      return {
        media: (
          <ShopifyDocumentStatus
            isActive={status === 'active'}
            isDeleted={isDeleted}
            type="productVariant"
            url={previewImageUrl}
            title={title}
          />
        ),
        subtitle: status,
        title: `${title != 'Default Title' ? `${sku} - ${title}` : 'Default'}`,
      }
    },
  },
})
