<template>
    <div>
        <AboutHero 
            :hero="aboutData?.hero" 
        />
        <AboutNada
            :aboutNada="aboutData?.aboutNadaDebs"
            :handmadeHeartmade="aboutData?.handmadeHeartmade"
        />
        <AboutStudio
            :aboutStudio="aboutData?.aboutStudio"
        />
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getAboutData } from '@/data/about'

const aboutData = await getAboutData()

useSeoObject(aboutData?.seo, aboutData?.title)
</script>