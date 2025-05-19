import project from './project'
import product from './product'
import about from './singleton/about'
import homepage from './singleton/homePage'
import studio from './singleton/studio'
import collaborations from './singleton/collaborations'
import interiors from './singleton/interiors'
import collaboration from './collaboration'
import interior from './interior'
import interiorCategory from './interior/category'
import contact from './singleton/contact'
import page from './page'
import siteConfig from './siteConfig'
import category from './project/category'
import gallery from './blockContentFlexibleObjects/gallery'
import media from './blockContentFlexibleObjects/media'
import blockContent from './blockContent'
import seo from './common/seo'
import navigation from './navigation/navigation'
import navigationItem from './navigation/navigationItem'
import link from './common/link'
import phone from './common/phone'
import textContent from './common/textContent'
import projectsArchive from './singleton/projectsArchive'
import pageBuilder from './pageBuilder'

import inventory from './shopify/inventory'
import option from './shopify/option'
import priceRange from './shopify/priceRange'
import productWithVariant from './shopify/productWithVariant'
import shopifyCollection from './shopify/shopifyCollection'
import shopifyCollectionRule from './shopify/shopifyCollectionRule'
import shopifyProduct from './shopify/shopifyProduct'
import productVariant from './productVariant'
import shopifyProductVariant from './shopify/shopifyProductVariant'
import proxyString from './shopify/proxyString'
import shopArchive from './shopArchive'


export const schemaTypes = [
  project,
  product,
  projectsArchive,
  about,
  homepage,
  studio,
  collaborations,
  interiors,
  collaboration,
  interior,
  interiorCategory,
  contact,
  page,
  category,
  gallery,
  media,
  seo,
  siteConfig,
  navigation,
  navigationItem,
  link,
  phone,
  blockContent,
  textContent,
  pageBuilder,

  inventory,
  option,
  priceRange,
  productWithVariant,
  shopifyCollection,
  shopifyCollectionRule,
  shopifyProduct,
  productVariant,
  shopifyProductVariant,
  proxyString,
  shopArchive,
]
