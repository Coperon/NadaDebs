import {GrNavigate} from 'react-icons/gr'

export default {
  name: 'navigationItem',
  title: 'Navigation Item',
  type: 'object',
  icon: GrNavigate,
  fields: [
    {
      name: 'text',
      type: 'string',
      title: 'Navigation Text',
    },
    {
      title: 'Link url',
      name: 'link',
      type: 'link',
    }
  ],
}
