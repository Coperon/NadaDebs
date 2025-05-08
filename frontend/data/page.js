import groq from 'groq'
import { blockContentQuery, seoQuery } from "./fragments"

export const getPageBySlug = async pageSlug => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_type == "page" && !(_id in path("drafts.**")) && slug.current == $pageSlug][0]{
      _id,
      title,
      seo {
          ${seoQuery}
      },
      slug,
      date,
      content[]{
        ${blockContentQuery}
      }  
    }`
    const key = `page-${pageSlug}`
    const { data } = await useAsyncData(key, () =>
        $sanity.fetch(query, { pageSlug: pageSlug }),
    )

    // throw 404 if project doesn't exist
    if (!data.value || Object.keys(data.value).length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Page Not Found',
            // fatal:true if using client previews and want to keep full full-screen error page there
            fatal: true,
        })
    }
    return data
}
