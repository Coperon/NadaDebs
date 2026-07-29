import groq from 'groq'

import { imageQuery, seoQuery } from "./fragments"

export const getShopPageData = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_id == "shop"][0] {
        _id,
        title,
        productImageBackgroundColor,
        seo {
            ${seoQuery}
        },
        cover {
            image {
                ${imageQuery}
            },
            video
        },
        objects {
            image {
                ${imageQuery}
            },
            video
        },
        furniture {
            image {
                ${imageQuery}
            },
            video
        },
        collections {
            image {
                ${imageQuery}
            },
            video
        }
    }
    `
    const { data } = await useAsyncData('shop', () => $sanity.fetch(query))
    return data
}
