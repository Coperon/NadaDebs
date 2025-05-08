import groq from 'groq'

import { blockContentQuery, seoQuery, pageBuilder } from "./fragments"

export const getHomepageData = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_id == "homepage"][0] {
      _id,
      title,
      seo {
          ${seoQuery}
      },
      content[]{
        ${blockContentQuery}
      },
      ${pageBuilder}
    }
    `
    const { data } = await useAsyncData('homepage', () => $sanity.fetch(query))
    return data
}
