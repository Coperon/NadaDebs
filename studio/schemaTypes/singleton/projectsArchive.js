import {RiProfileLine} from 'react-icons/ri'
import {IoMdAnalytics} from 'react-icons/io'

export default {
    name: 'projectsArchive',
    title: 'Projects Archive',
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
            title: 'Title',
            name: 'title',
            type: 'string',
            group: 'page',
            description: 'This is Projects Archive page. It will display all the projects in the archive.',
        },
        {
            name: 'seo',
            title: 'SEO',
            type: 'seo',
            group: 'seo',
        },
    ],
    }