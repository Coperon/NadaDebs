<template>
    <div>
        <div @mousemove="handleMouseMove">
            <img 
                ref="mapImage" 
                src="/map.svg" 
                class="w-full h-auto" 
            />
        </div>
        <div v-if="coordinates" class="fixed top-6 left-6 text-white bg-black py-2 px-4 z-50">
            X: {{ coordinates.x }}, Y: {{ coordinates.y }}
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: false
})

useHead({
    meta: [
        { name: 'robots', content: 'noindex, nofollow' },
    ]
})

const mapImage = ref(null)
const coordinates = ref(null)

const handleMouseMove = (event) => {
    if (!mapImage.value) return
    
    const rect = mapImage.value.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    
    coordinates.value = {
        x: Math.round(x),
        y: Math.round(y)
    }
}
</script>