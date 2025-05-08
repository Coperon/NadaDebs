import {GoFileMedia} from 'react-icons/go'
import {GrGallery} from 'react-icons/gr'
import { TfiParagraph } from "react-icons/tfi";

export default {
    name: 'pageBuilder',
    title: 'Page Builder',
    type: 'object',
    fields: [
        {
            name: 'builder',
            title: 'Builder',
            type: 'array',
            of: [
                {
                    name: 'builderTextContent',
                    title: 'Text',
                    type: 'object',
                    fields: [
                        {
                            name: 'content',
                            title: 'Content',
                            type: 'textContent',
                        }
                    ],
                    icon: TfiParagraph,
                    preview: {
                        select: {
                            title: 'content',
                        },
                        prepare(selection) {
                            const {title} = selection
                            return {
                                title: title ? title[0]?.children[0]?.text : '',
                            }
                        }
                    }
                },
                {
                    name: 'builderMedia',
                    title: 'Media',
                    type: 'media',
                    icon: GoFileMedia,
                },
                {
                    name: 'builderGallery',
                    title: 'Gallery',
                    type: 'gallery',
                    icon: GrGallery,
                },
                
            ]
        },
    ]
}