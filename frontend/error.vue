<template>
    <div id="main-content-wrapper" class="flex flex-col min-h-min 404-content">
        <main
            id="main-content"
            class="relative min-h-svh flex flex-col items-center justify-center text-center"
        >
            <h2
                class="p-4 uppercase"
                v-html="error?.statusCode == '404' ? text404 : defaultText"
            ></h2>
            <DevOnly>
                {{ error }}
            </DevOnly>
        </main>
    </div>
</template>

<script setup>
const props = defineProps({
    error: Object,
})
const metaTitle = props.error?.statusCode == '404' ? '404 - Page not found' : 'Something went wrong'

const defaultText = 'Sorry, something went wrong.<br>Please try again later'
const text404 =
    '404<br>The page could not be found<br>Please visit our <a href="/" class="text-blue">homepage to start fresh</a>'
useHead({
    title: metaTitle,
})
</script>
