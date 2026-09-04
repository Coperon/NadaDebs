import groq from 'groq'

import { imageQuery, seoQuery } from "./fragments"

export const getStudioData = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_id == "studio"][0] {
        _id,
        title,
        seo {
            ${seoQuery}
        },
        cover {
            image {
                ${imageQuery}
            },
            video
        },
        collaborations {
            image {
                ${imageQuery}
            },
            video
        },
        interiors {
            image {
                ${imageQuery}
            },
            video
        },
        bespoke {
            image {
                ${imageQuery}
            },
            video
        }
    }
    `
    const { data } = await useAsyncData('studio', () => $sanity.fetch(query))
    liveRefetch(data, query)
    return data
}
