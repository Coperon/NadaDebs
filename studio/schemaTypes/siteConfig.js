import {IoShareSocialOutline} from 'react-icons/io5'
import {CiGlobe} from 'react-icons/ci'
import {CiShare2} from 'react-icons/ci'
import {MdOutlineEmail} from 'react-icons/md'
import {MdOutlinePrivacyTip} from 'react-icons/md'
import {FaCreativeCommons} from 'react-icons/fa'
import {IoMdAnalytics} from 'react-icons/io'
import {DEFAULT_CURRENCY_CODE} from '../constants'
import { LuText } from "react-icons/lu";

export default {
  name: 'siteConfig',
  title: 'Site Global',
  type: 'document',
  groups: [
    {
      name: 'site',
      title: 'Site',
      default: true,
      icon: CiGlobe,
    },
    {
      name: 'strings',
      title: 'Strings',
      icon: LuText,
    },
    {
      name: 'social',
      title: 'Social',
      icon: CiShare2,
    },
    {
      name: 'legalLinks',
      title: 'Legal Links',
      icon: MdOutlinePrivacyTip,
    },
    {
      name: 'seo',
      title: 'SEO',
      icon: IoMdAnalytics,
    },
  ],
  fieldsets: [
    {
      name: 'cookieBanner',
      title: 'Cookie Banner',
      options: {columns: 2},
    },
  ],
  fields: [
    {
      title: 'Site Title',
      name: 'siteTitle',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'site',
    },
    {
      name: 'siteLanguage',
      title: 'Site Language Code (ISO 639-1)',
      type: 'string',
      initialValue: 'en',
      group: 'site',
      readOnly: true,
    },
    {
      name: 'currencyCode',
      title: 'Currency Code (ISO 4217)',
      type: 'string',
      options: {
        list: [
          // {title: 'Euro', value: 'EUR'},
          {title: 'US Dollar', value: 'USD'},
          // {title: 'Pound Sterling', value: 'GBP'},
        ],
        allowNull: false,
      },
      initialValue: DEFAULT_CURRENCY_CODE,
      group: 'site',
    },
    {
      title: 'Favicon',
      name: 'siteFavicon',
      type: 'image',
      validation: (Rule) => Rule.required(),
      group: 'site',
    },
    {
      name: 'gtmID',
      title: 'Google Tag Manager ID',
      type: 'string',
      description: 'Add GTM ID to enable Analytics (and cookie banner)',
      group: 'site',
      fieldset: 'cookieBanner',
    },
    {
      name: 'cookiesPolicyLink',
      title: 'Cookies Policy Link',
      type: 'reference',
      to: [{type: 'page'}],
      weak: true,
      description: 'Link to be used in the cookie banner',
      fieldset: 'cookieBanner',
      hidden: ({document, parent}) => {
        return parent?.gtmID == undefined
      },
      group: 'site',
    },
    {
      name: 'onlyUAE',
      title: 'Only in UAE',
      type: 'text',
      rows: 3,
      description: 'Displayed in the product page when the product is only available in the UAE',
      group: 'strings',
    },
    {
      title: 'Social links',
      name: 'socialLinks',
      type: 'array',
      description: 'Add links to your social profiles (instagram, linkedin, twitter, etc.)',
      group: 'social',
      of: [
        {
          name: 'socialLink',
          title: 'Link',
          type: 'object',
          icon: IoShareSocialOutline,
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'icon',
              title: 'Icon',
              type: 'image',
              options: {
                accept: 'image/svg+xml',
              },
              validation: (Rule) => Rule.required(),
            }
          ],
        },
      ],
    },
    {
      name: 'termsAndConditions',
      title: 'Terms and Conditions',
      type: 'reference',
      to: [{type: 'legal'}],
      group: 'legalLinks',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'privacyPolicy',
      title: 'Privacy Policy',
      type: 'reference',
      to: [{type: 'legal'}],
      group: 'legalLinks',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'shippingPolicy',
      title: 'Shipping & ReturnsPolicy',
      type: 'reference',
      to: [{type: 'legal'}],
      group: 'legalLinks',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    },
  ],
}
