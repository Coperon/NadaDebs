<template>
    <div class="hidden md:block mt-20 sm:mt-24 lg:mt-30 mx-4 sm:mx-6 lg:mx-8 xl:mx-12 relative">
        <img src="/world-map.svg" alt="map" class="w-full h-auto" />

        <div class="absolute top-12 right-12 bg-white p-3 flex flex-col gap-1">
            <div class="flex items-center gap-1.5">
                <div class="w-2 h-2 border border-black bg-black rounded-full"></div>
                <span class="text-p2 font-medium">Nada's Journey</span>
            </div>
            <div class="flex items-center gap-1.5">
                <div class="w-2 h-2 border border-black bg-white rounded-full"></div>
                <span class="text-p2 font-medium">Craft Stories</span>
            </div>
        </div>

        <div v-for="(marker, index) in markers" :key="index">
            <div class="absolute" :style="{ left: marker.coordinates.x + '%', top: marker.coordinates.y + '%' }">
                <div
                    @mouseenter="toggleMarker(index)"
                    @mouseleave="toggleMarker(index)"
                    class="w-4 h-4 border border-black rounded-full cursor-pointer -ml-2 -mt-2 relative group"
                    :class="marker.category === 'N' ? 'bg-black' : 'bg-white'"
                >
                    <div class="absolute z-10 -top-[calc(100%+0.25rem)] left-1/2 -translate-x-1/2 text-center text-a2-bold pointer-events-none opacity-0 group-hover:opacity-100 2xl:opacity-100 transition-opacity duration-300 ease-in-out">
                        {{ marker.location }}
                    </div>
                </div>

                <Transition name="fade">
                    <div 
                        v-if="isOpen[index]" 
                        class="absolute z-50 -top-52 p-4 bg-white w-80 h-44 overflow-hidden flex gap-2.5"
                        :class="marker.coordinates.x > 50 ? 'right-0' : 'left-0'"
                    >
                        <div class="w-2/5 bg-beige relative overflow-hidden">
                            <CommonMediaImage
                                v-if="marker.image"
                                :image="marker.image"
                                :alt="marker.title"
                                width="768"
                                mobileWidth="384"
                                class="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                        <div class="w-3/5 overflow-y-auto">
                            <div class="text-h2">{{ marker.title }}</div>
                            <div v-if="marker.text" class="mt-0.5 text-p2">{{ marker.text }}</div>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    markers: {
        type: Array,
        required: true
    }
})

const isOpen = ref(props.markers.map(() => false))

const toggleMarker = (index) => {
    if (isOpen.value[index]) {
        isOpen.value[index] = false
    } else {
        isOpen.value = isOpen.value.map(() => false)
        isOpen.value[index] = true
    }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>