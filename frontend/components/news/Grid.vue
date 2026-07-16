<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 md:gap-y-12 xl:gap-y-16 gap-x-3.5">
        <div v-for="post in posts" :key="post._id">
            <NuxtLink :to="`/news/latest/${post.slug.current}`" class="group">
                <div class="relative overflow-hidden aspect-[3/2] group-hover:opacity-50 transition-opacity duration-300">
                    <CommonMediaImage
                        :image="post.thumbnail"
                        :alt="post.title"
                        width="512"
                        mobileWidth="384"
                        class="w-full h-full object-cover"
                    />
                </div>

                <CommonGridCaption>
                    <h2 class="text-h2 uppercase flex flex-col">{{ post.title }}</h2>

                    <div v-if="post.date" class="text-p2 opacity-30">
                        {{ formatDate(post.date) }}
                    </div>

                    <div v-if="post.text" class="text-p2 mt-1 line-clamp-2">
                        {{ post.text }}
                    </div>
                </CommonGridCaption>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    posts: {
        type: Array,
        required: true,
    },
})

const { formatDate } = useDateFormat()
</script>