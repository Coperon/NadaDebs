import groq from 'groq'

import { imageQuery, seoQuery } from "./fragments"

export const getWorkWithUs = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_id == "workWithUs"][0] {
        _id,
        title,
        description,
        openPositions,
        aboutTheCompany {
            description,
            images[] {
                ${imageQuery}
            }
        },
        team[] {
            name,
            role,
            image {
                ${imageQuery}
            }
        },
        seo {
            ${seoQuery}
        },
    }`
    const { data } = await useAsyncData('workWithUs', () => $sanity.fetch(query))
    return data
}
