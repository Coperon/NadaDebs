<template>
    <aside v-if="relatedProjects && relatedProjects?.length > 0" class="pb-20 sm:pb-24 lg:pb-30">
        <CommonAsideHeading title="Related Projects" />
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