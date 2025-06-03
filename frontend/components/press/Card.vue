<template>
    <div>
        <div class="relative overflow-hidden aspect-[3/4]">
            <CommonMediaImage
                :image="image"
                :alt="image?.alt"
                width="384"
                mobileWidth="384"
                class="w-full h-full object-cover"
            />
        </div>

        <div class="px-4 mt-2.5 lg:mt-5">
            <div class="text-h2 uppercase">
                {{ formatDate(date) }}
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    image: {
        type: Object,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
})

const { formatDate } = useDateFormat()
</script>