<template>
    <div class="pt-[3.25rem] sm:pt-[4.25rem] pb-20 sm:pb-24 lg:pb-30">
        <CommonPageHeader 
            :title="data?.title" 
            :description="data?.description" 
        />

        <div class="flex flex-col gap-20 md:flex-row md:items-start md:gap-0">
            <div v-if="data?.image" class="aspect-square sm:aspect-auto relative overflow-hidden sm:h-svh md:sticky md:top-0 md:w-1/2">
                <CommonMediaImage
                    :image="data.image"
                    :alt="data.image.alt"
                    width="768"
                    mobileWidth="768"
                    class="absolute inset-0 w-full h-full object-cover"
                />
            </div>

            <div class="px-4 sm:px-6 lg:px-8 xl:px-12 max-w-screen-sm mx-auto md:w-1/2">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})
</script>