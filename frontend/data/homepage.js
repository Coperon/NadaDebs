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
            video,
            mobileImage {
                ${imageQuery}
            },
            mobileVideo
        },
        shop {
            image {
                ${imageQuery}
            },
            video,
            mobileImage {
                ${imageQuery}
            },
            mobileVideo
        },
        studio {
            image {
                ${imageQuery}
            },
            video,
            mobileImage {
                ${imageQuery}
            },
            mobileVideo
        }
    }
    `
    const { data } = await useAsyncData('homepage', () => $sanity.fetch(query))
    liveRefetch(data, query)
    return data
}
