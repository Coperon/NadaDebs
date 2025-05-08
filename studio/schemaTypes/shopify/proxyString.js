import {defineField} from 'sanity'

import ProxyStringInput from '../../src/components/inputs/ProxyString'

export default defineField({
  name: 'proxyString',
  title: 'Title',
  type: 'string',
  components: {
    input: ProxyStringInput,
  },
})
