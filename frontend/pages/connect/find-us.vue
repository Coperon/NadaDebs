<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem] pb-20 sm:pb-24 lg:pb-30">
        <CommonPageHeader 
            :title="findUsData?.title" 
            :description="findUsData?.description" 
        />

        <div class="px-4 sm:px-6 lg:px-8 xl:px-12 max-w-4xl mx-auto">
            <div v-if="findUsData?.offices && findUsData?.offices?.length > 0">
                <h2 class="text-a1-bold uppercase text-center">Offices</h2>

                <div class="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-16">
                    <template v-for="officesList in findUsData?.offices" :key="officesList._key">
                        <div :class="officesList.offices.length > 2 ? 'lg:col-span-3' : officesList.offices.length > 1 ? 'lg:col-span-2' : ''">
                            <h3 class="font-bold uppercase">{{ officesList.country }}</h3>

                            <div class="mt-6 grid grid-cols-1 gap-8 sm:gap-12 lg:gap-16" :class="officesList.offices.length > 2 ? 'lg:grid-cols-3' : officesList.offices.length > 1 ? 'lg:grid-cols-2' : ''">
                                <div v-for="office in officesList.offices" :key="office._key">
                                    <h4 class="uppercase">{{ office.name }}</h4>
                                    <div class="whitespace-pre-line">{{ office.info }}</div>
                                    <div v-if="office.map" class="mt-4 md:mt-6">
                                        <a :href="office.map" target="_blank" class="flex items-center gap-1.5 group">
                                            <IconsPin class="w-3 h-3" />
                                            <span class="text-p2 font-medium">Get directions</span>
                                            <IconsArrow class="w-3 h-auto opacity-30 group-hover:opacity-100 transition-opacity duration-300" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <div class="h-px bg-black/20 my-12 sm:my-16"></div>

            <div v-if="findUsData?.whereToFindUs && findUsData?.whereToFindUs?.length > 0">
                <h2 class="text-a1-bold uppercase text-center">Where to find us</h2>

                <div class="mt-10 columns-1 sm:columns-2 sm:gap-16 lg:columns-3">
                    <div v-for="list in findUsData?.whereToFindUs" :key="list._key" class="mb-6 break-inside-avoid">
                        <h3 class="font-bold uppercase">{{ list.country }}</h3>

                        <ul class="mt-1.5 flex flex-col gap-1.5">
                            <li v-for="store in list.stores" :key="store._key">
                                <a :href="store.url" target="_blank" class="group">
                                    <span class="uppercase">{{ store.name }}</span>
                                    <IconsArrow class="inline-block w-3 h-auto mb-0.5 ml-1.5 opacity-30 group-hover:opacity-100 transition-opacity duration-300" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useSeoObject } from '@/composables/seo'
import { getFindUs } from '@/data/findUs'

const findUsData = await getFindUs()

useSeoObject(findUsData?.seo, findUsData?.title)
</script>