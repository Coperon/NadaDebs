import {IoShareSocialOutline} from 'react-icons/io5'
import {CiGlobe} from 'react-icons/ci'
import {CiShare2} from 'react-icons/ci'
import {MdOutlineEmail} from 'react-icons/md'
import {MdOutlinePrivacyTip} from 'react-icons/md'
import {FaCreativeCommons} from 'react-icons/fa'
import {IoMdAnalytics} from 'react-icons/io'
import {DEFAULT_CURRENCY_CODE} from '../constants'

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
      name: 'social',
      title: 'Social',
      icon: CiShare2,
    },
    {
      name: 'contact',
      title: 'Contact',
      icon: MdOutlineEmail,
    },
    {
      name: 'legalLinks',
      title: 'Legal Links',
      icon: MdOutlinePrivacyTip,
    },
    {
      name: 'credits',
      title: 'Credits',
      icon: FaCreativeCommons,
    },
    {
      name: 'seo',
      title: 'SEO',
      icon: IoMdAnalytics,
    },
  ],
  fieldsets: [
    {
      name: 'brand',
      title: 'Branding',
      options: {columns: 2},
    },
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
    },
    {
      name: 'currencyCode',
      title: 'Currency Code (ISO 4217)',
      type: 'string',
      options: {
        list: [
          {title: 'Euro', value: 'EUR'},
          // {title: 'US Dollar', value: 'USD'},
          // {title: 'Pound Sterling', value: 'GBP'},
        ],
        allowNull: false,
      },
      initialValue: DEFAULT_CURRENCY_CODE,
      group: 'site',
    },
    {
      title: 'Site Logo',
      name: 'siteLogo',
      type: 'inlineSvg',
      validation: (Rule) => Rule.required(),
      group: 'site',
      fieldset: 'brand',
    },
    {
      title: 'Site Favicon',
      name: 'siteFavicon',
      type: 'image',
      validation: (Rule) => Rule.required(),
      group: 'site',
      fieldset: 'brand',
    },
    {
      title: 'Main navigation',
      name: 'mainNav',
      description: 'Select menu for main navigation',
      type: 'reference',
      to: {type: 'navigation'},
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
          ],
        },
      ],
    },

    {
      name: 'legalLinks',
      title: 'Legal Pages',
      type: 'array',
      group: 'legalLinks',
      of: [
        {
          type: 'reference',
          to: [{type: 'page'}],
        },
      ],
    },
    {
      name: 'contact',
      title: 'Contact',
      type: 'object',
      group: 'contact',
      fields: [
        {
          name: 'email',
          title: 'EMAIL',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        // {
        //   name: 'phone',
        //   title: 'PHONE',
        //   type: 'phone',
        // },
        {
          name: 'address',
          title: 'ADDRESS',
          type: 'text',
          rows: 3,
        },
      ],
    },
    {
      name: 'credits',
      title: 'Credits',
      type: 'textContent',
      group: 'credits',
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    },
  ],
}
