<template>
    <div class="px-4 sm:px-6 lg:px-8 xl:px-12 py-32">
        <h1 class="text-h2 uppercase">Email Preview</h1>
        <p class="text-p2 mt-2">Preview shared email design for admin/sender variants.</p>

        <div class="mt-6 flex flex-wrap gap-2">
            <button
                v-for="item in types"
                :key="item"
                type="button"
                class="px-4 py-2 border text-a2"
                :class="type === item ? 'bg-black text-white border-black' : 'border-black/30'"
                @click="type = item"
            >
                {{ item }}
            </button>
        </div>

        <div class="mt-3 flex flex-wrap gap-2">
            <button
                v-for="item in variants"
                :key="item"
                type="button"
                class="px-4 py-2 border text-a2"
                :class="variant === item ? 'bg-black text-white border-black' : 'border-black/30'"
                @click="variant = item"
            >
                {{ item }}
            </button>
        </div>

        <div class="mt-6">
            <iframe :src="previewSrc" class="w-full h-[80vh]" />
        </div>
    </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

const types = ['trade', 'contact', 'apply']
const variants = ['admin', 'sender']

const type = ref(String(route.query.type || 'trade'))
const variant = ref(String(route.query.variant || 'admin'))

watch([type, variant], () => {
    router.replace({
        query: {
            ...route.query,
            type: type.value,
            variant: variant.value
        }
    })
})

const previewSrc = computed(() => `/api/dev/email-preview?type=${encodeURIComponent(type.value)}&variant=${encodeURIComponent(variant.value)}`)
</script>
