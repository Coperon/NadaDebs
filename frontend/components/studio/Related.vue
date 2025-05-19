<template>
    <aside v-if="relatedProjects && relatedProjects?.length > 0" class="pb-12">
        <div class="px-4 py-12 xl:pt-24">
            <h2 class="text-a2-bold uppercase text-center">Explore More</h2>
        </div>

        <div>
            <StudioGrid 
                :items="relatedProjects" 
                :showFeatured="false" 
                :isCollaboration="isCollaboration" 
                :route="route"
            />
        </div>
    </aside>
</template>

<script setup>
defineProps({
    relatedProjects: {
        type: Array,
        required: true,
    },
    isCollaboration: {
        type: Boolean,
        required: false,
        default: false,
    },
    route: {
        type: String,
        required: true,
    },
})
</script>