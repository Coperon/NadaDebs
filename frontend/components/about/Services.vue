<template>
    <section>
        <AboutText :title="services?.title" :text="services?.text" class="text-center" />

        <div v-if="services?.services && services?.services?.length > 0" class="sm:hidden mt-10 grid grid-cols-1 gap-y-8">
            <div v-for="(service, index) in services?.services" :key="index">
                <div v-if="service.image" class="aspect-square relative overflow-hidden">
                    <CommonMediaImage
                        :image="service.image"
                        :alt="service.image.alt"
                        width="768"
                        mobileWidth="768"
                        class="w-full h-full object-cover"
                    />
                </div>

                <div class="px-4 mt-2.5 lg:mt-5">
                    <h3 class="text-h2 uppercase">{{ service.title }}</h3>

                    <div v-if="service.continuationText" class="text-p2">
                        {{ service.continuationText }}
                    </div>
                </div>
            </div>
        </div>

        <div 
            v-if="services?.services && services?.services?.length > 0" 
            ref="servicesContainer"
            class="hidden sm:flex mt-20 sm:mt-24 lg:mt-30 h-svh isolate"
        >
            <div class="w-1/2 p-4 sm:p-6 lg:p-8 xl:p-12">
                <ul class="flex flex-col items-center text-center justify-center gap-8 h-full">
                    <li 
                        v-for="(service, index) in services?.services" 
                        :key="index"
                        @click="handleServiceClick(index)"
                        class="cursor-pointer"
                    >
                        <h3 
                            :class="[
                                activeIndex === index ? 'text-a2-bold' : 'text-a2 opacity-30',
                                'uppercase transition-opacity duration-300 hover:opacity-100'
                            ]"
                        >
                            {{ service.title }}
                        </h3>

                        <div 
                            v-if="service.continuationText && activeIndex === index" 
                            class="text-p2 mt-1 max-w-[48ch] text-balance transition-all duration-300"
                        >
                            {{ service.continuationText }}
                        </div>
                    </li>
                </ul>
            </div>

            <div class="w-1/2 relative overflow-hidden">
                <div 
                    v-for="(service, index) in services?.services" 
                    :key="index" 
                    class="absolute inset-0 transition-all duration-500"
                    :class="activeIndex === index ? 'z-10 opacity-100' : 'z-0 opacity-0'"
                >
                    <CommonMediaImage
                        v-if="service.image"
                        :image="service.image"
                        :alt="service.image.alt"
                        width="768"
                        mobileWidth="768"
                        class="absolute inset-0 w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
const props = defineProps({
    services: {
        type: Object,
        required: true
    }
})

const activeIndex = ref(0)
const servicesContainer = ref(null)

const handleServiceClick = (index) => {
    activeIndex.value = index
    servicesContainer.value?.scrollIntoView({ behavior: 'smooth' })
}
</script>