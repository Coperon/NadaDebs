import {RiProfileLine} from 'react-icons/ri'
import {IoMdAnalytics} from 'react-icons/io'
import {HomeIcon} from '@sanity/icons'
import {EarthAmericasIcon} from '@sanity/icons'
import {BasketIcon} from '@sanity/icons'

export default {
    name: 'findUs',
    title: 'Find us',
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
            name: 'offices',
            title: 'Offices',
            type: 'array',
            group: 'page',
            validation: (Rule) => Rule.required(),
            of: [
                {
                    name: 'officesList',
                    title: 'Offices List',
                    type: 'object',
                    icon: EarthAmericasIcon,
                    fields: [
                        {
                            name: 'country',
                            title: 'Country',
                            type: 'string',
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: 'offices',
                            title: 'Offices',
                            type: 'array',
                            of: [
                                {
                                    name: 'office',
                                    title: 'Office',
                                    type: 'object',
                                    icon: HomeIcon,
                                    fields: [
                                        {
                                            name: 'name',
                                            title: 'Name',
                                            type: 'string',
                                            validation: (Rule) => Rule.required(),
                                        },
                                        {
                                            name: 'info',
                                            title: 'Info (Address, phone, email...)',
                                            type: 'text',
                                            rows: 5,
                                            validation: (Rule) => Rule.required(),
                                        },
                                        {
                                            name: 'map',
                                            title: 'Google Maps Link',
                                            type: 'url',
                                        }
                                    ],
                                }
                            ]
                        },
                    ]
                }
            ]
        },
        {
            name: 'whereToFindUs',
            title: 'Where to find us (Stores)',
            type: 'array',
            group: 'page',
            validation: (Rule) => Rule.required(),
            of: [
                {
                    name: 'whereToFindUsList',
                    title: 'Stores list by country',
                    type: 'object',
                    icon: EarthAmericasIcon,
                    fields: [
                        {
                            name: 'country',
                            title: 'Country',
                            type: 'string',
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: 'stores',
                            title: 'Stores',
                            type: 'array',
                            of: [
                                {
                                    name: 'store',
                                    title: 'Store',
                                    type: 'object',
                                    icon: BasketIcon,
                                    fields: [
                                        {
                                            name: 'name',
                                            title: 'Name',
                                            type: 'string',
                                            validation: (Rule) => Rule.required().max(24),
                                        },
                                        {
                                            name: 'url',
                                            title: 'URL',
                                            type: 'url',
                                            validation: (Rule) => Rule.required(),
                                        },
                                    ],
                                }
                            ]
                        },
                    ]
                }
            ]
        },
        {
            name: 'seo',
            title: 'SEO',
            type: 'seo',
            group: 'seo',
        }
    ],
}