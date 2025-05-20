import groq from 'groq'

import { imageQuery, seoQuery } from "./fragments"

export const getAboutData = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_id == "about"][0] {
        _id,
        title,
        hero {
            title,
            description,
            image {
                ${imageQuery}
            },
            video
        },
        seo {
            ${seoQuery}
        },
    }`
    const { data } = await useAsyncData('about', () => $sanity.fetch(query))
    return data
}
