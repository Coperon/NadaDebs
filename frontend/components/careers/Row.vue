<template>
    <dl class="flex flex-col gap-4 relative md:flex-row md:items-center md:gap-6">
        <div class="md:w-1/6">
            <dt class="md:hidden text-a2 lowercase mb-1">City</dt>
            <dd class="text-a2-bold uppercase">{{ position?.location }}</dd>
        </div>
        <div class="md:w-1/3 lg:w-1/2">
            <dt class="md:hidden text-a2 lowercase mb-1">Position</dt>
            <dd>
                <h1 v-if="isSingle" class="inline">{{ position?.position }}</h1>
                <span v-else>{{ position?.position }}</span>
                <template v-if="position?.experience">{{ ` | ${position?.experience}` }}</template>
                <template v-if="position?.type">{{ ` | ${position?.type}` }}</template>
            </dd>
        </div>
        <div class="md:w-1/6">
            <dt class="md:hidden text-a2 lowercase mb-1">Open Until</dt>
            <dd>{{ formatDate(position?.openUntil) }}</dd>
        </div>

        <div v-if="isSingle" class="flex justify-start md:justify-end sm:absolute sm:right-0 sm:top-0 md:static md:w-1/3 lg:w-1/6">
            <a :href="position?.applyLink" target="_blank">
                <CommonButton>Apply</CommonButton>
            </a>
        </div>
        <div v-else class="absolute right-0 top-0 md:static md:w-1/3 lg:w-1/6 md:flex md:justify-end">
            <IconsArrow class="w-3 h-auto" />
        </div>
    </dl>
</template>

<script setup>
const { formatDate } = useDateFormat()

const props = defineProps({
    position: {
        type: Object,
        required: true
    },
    isSingle: {
        type: Boolean,
        default: false
    }
})
</script>