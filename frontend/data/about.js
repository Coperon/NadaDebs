import groq from 'groq'

import { blockContentQuery, seoQuery } from "./fragments"

export const getAboutData = async () => {
    const { $sanity } = useNuxtApp()
    const query = groq`*[_id == "about"][0] {
        _id,
        title,
        seo {
            ${seoQuery}
        },
        content[]{
           ${blockContentQuery} 
        }  
    }`
    const { data } = await useAsyncData('about', () => $sanity.fetch(query))
    return data
}
