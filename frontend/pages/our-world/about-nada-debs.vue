<template>
    <div>
        <AboutHero 
            :hero="aboutData?.hero" 
        />

        <div class="py-20 sm:py-24 lg:py-30 flex flex-col gap-20 sm:gap-24 lg:gap-30">
            <AboutNada
                :aboutNada="aboutData?.aboutNadaDebs"
                :markers="aboutData?.markers"
                :handmadeHeartmade="aboutData?.handmadeHeartmade"
            />
            <AboutStudio
                :aboutStudio="aboutData?.aboutStudio"
            />
            <AboutServices
                :services="aboutData?.services"
            />
        </div>
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getAboutData } from '@/data/about'

const aboutData = await getAboutData()

useSeoObject(aboutData?.value?.seo, aboutData?.value?.title)
</script>