import groq from 'groq'
import { blockContentQuery, imageQuery, seoQuery } from "./fragments"

export const getProjectBySlug = async projectSlug => {
  const { $sanity } = useNuxtApp()
    const query = groq`*[_type == "project" && !(_id in path("drafts.**")) && slug.current == $projectSlug][0]{
      _id,
      title,
      seo {
        ${seoQuery}
      },
      slug,
      date,
      featuredImage {
        ${imageQuery}
      },
      content[]{
        ${blockContentQuery}
      }  
    }`
    const key = `work-${projectSlug}`
    const { data } = await useAsyncData(key, () =>
        $sanity.fetch(query, { projectSlug: projectSlug }),
    )
    liveRefetch(data, query, { projectSlug: projectSlug })

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
