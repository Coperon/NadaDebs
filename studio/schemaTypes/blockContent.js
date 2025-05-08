import {LuHighlighter} from 'react-icons/lu'
import {GoFileMedia} from 'react-icons/go'
import {GrGallery} from 'react-icons/gr'
import { MdFormatQuote } from "react-icons/md";

import HighlightDecorator from '../src/components/HighlightDecorator'
import Blockquote from './../src/components/Blockquote'
import CustomStyle from './../src/components/CustomStyle'

export default {
  name: 'blockContent',
  title: 'Block Content',
  description: `This is the main content editor. Click the expand arrows in the right corner (or press CMD + ENTER) to enter editor's full-screen mode. You can return to the normal view by clicking the arrows again or pressing the "ESC" key.`,
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H1', value: 'h1'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        // {title: 'Quote', value: 'blockquote'},
        // Example of custom style with custom component
        // {
        //   title: 'Custom Style',
        //   value: 'customStyle',
        //   component: CustomStyle
        // },
      ],
      lists: [{title: 'Bullet', value: 'bullet'}],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Italic', value: 'em'},
          // custom decorator example: yellow highlight
          {
            title: 'Highlight',
            value: 'highlight',
            icon: LuHighlighter,
            component: HighlightDecorator,
          },
          { 
            title: 'Quote',
            value: 'blockquote',
            icon: MdFormatQuote,
            component: Blockquote,
          },
        ],
        annotations: [
          {
            name: 'link',
            type: 'link',
          },
        ],
      },
    },
    // Example to allow to add a custom block type inside the editor, like a media block or a gallery
    {
      type: 'media',
      icon: GoFileMedia,
    },
    {
      type: 'gallery',
      title: 'Gallery',
      icon: GrGallery,
    },
  ],
}
