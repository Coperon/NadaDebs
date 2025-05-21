<template>
    <div class="mt-20 sm:mt-24 lg:mt-30 px-4 sm:px-6 lg:px-8 xl:px-12">
        <h3 v-if="content?.title" class="uppercase font-bold text-center mb-10 lg:mb-24">{{ content?.title }}</h3>

        <div class="lg:hidden">
            <div class="font-bold lowercase flex items-center justify-center gap-3">
                <span>Handmade</span>
                <IconsDots class="w-4 h-auto" />
                <span>Heartmade</span>
            </div>

            <div v-if="content?.handmade && content?.heartmade" class="mt-10 flex flex-col gap-[1.1875rem] text-center max-w-[75ch] mx-auto">
                <div v-if="content?.handmade">{{ content?.handmade }}</div>
                <div v-if="content?.heartmade">{{ content?.heartmade }}</div>
            </div>
        </div>

        <div class="hidden lg:flex items-center justify-center gap-20">
            <div 
                v-if="content?.handmade" 
                class="flex-1 flex justify-end relative"
                @mouseenter="isHandmadeVisible = true"
                @mouseleave="isHandmadeVisible = false"
            >
                <div 
                    class="text-right max-w-[62ch] transition-opacity duration-300"
                    :class="isHandmadeVisible ? 'opacity-100' : 'opacity-0'"
                >{{ content?.handmade }}</div>
                <div 
                    class="absolute top-1/2 -translate-y-1/2 right-0 text-4xl font-medium lowercase transition-opacity duration-300"
                    :class="isHandmadeVisible ? 'opacity-0' : 'opacity-100'"
                >Handmade</div>
            </div>

            <IconsDots class="w-20 h-auto" />

            <div 
                v-if="content?.heartmade" 
                class="flex-1 flex justify-start relative"
                @mouseenter="isHeartmadeVisible = true"
                @mouseleave="isHeartmadeVisible = false"
            >
                <div 
                    class="text-left max-w-[62ch] transition-opacity duration-300"
                    :class="isHeartmadeVisible ? 'opacity-100' : 'opacity-0'"
                >{{ content?.heartmade }}</div>
                <div 
                    class="absolute top-1/2 -translate-y-1/2 left-0 text-4xl font-medium lowercase transition-opacity duration-300"
                    :class="isHeartmadeVisible ? 'opacity-0' : 'opacity-100'"
                >Heartmade</div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    content: {
        type: Object,
        required: true
    }
})

const isHandmadeVisible = ref(false)
const isHeartmadeVisible = ref(false)
</script>