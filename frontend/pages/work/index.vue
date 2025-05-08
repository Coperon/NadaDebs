<template>
    <section class="projects grid grid-cols-12 gap-2">
        <article
            v-for="project in projectsData"
            :key="project._id"
            class="project col-span-6 md:col-span-4 group flex flex-col border"
        >
            <NuxtLink :to="`/work/${project?.slug?.current}`">
                <CommonMediaImage
                    class="block w-full h-auto"
                    :image="project?.featuredImage"
                    :alt="project?.title"
                    width="800"
                    height="600"
                    mobileWidth="500"
                    mobileHeight="375"
                />
            </NuxtLink>
            <div
                class="flex flex-col flex-1 lg:flex-row justify-between lg:items-center border-t p-2"
            >
                <h2 class="uppercase">{{ project?.title }}</h2>
                <NuxtLink
                    class="leading-none text-blue group-hover:underline"
                    :to="`/work/${project?.slug?.current}`"
                    >Read more</NuxtLink
                >
            </div>
        </article>
    </section>
</template>
<script setup>
import { buildBodyClass } from '@/utils'
import { useSeoObject } from '@/composables/seo'
import { getProjects } from '@/data/projects'
import { getProjectsArchiveMeta } from '@/data/projectsArchiveMeta'
const route = useRoute()
const path = route.path

const archiveMeta = await getProjectsArchiveMeta()
const projectsData = await getProjects()
const bodyClass = buildBodyClass(path)

useHead({
    bodyAttrs: {
        class: bodyClass,
    },
})

useSeoObject(archiveMeta?.value?.seo, archiveMeta?.value?.title)
</script>
