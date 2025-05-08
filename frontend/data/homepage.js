import groq from 'groq'

import { imageQuery, seoQuery } from "./fragments"

export const getHomepageData = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_id == "homepage"][0] {
        _id,
        title,
        seo {
            ${seoQuery}
        },
        ourWorld {
            image {
                ${imageQuery}
            },
            video
        },
        shop {
            image {
                ${imageQuery}
            },
            video
        },
        studio {
            image {
                ${imageQuery}
            },
            video
        }
    }
    `
    const { data } = await useAsyncData('homepage', () => $sanity.fetch(query))
    return data
}
