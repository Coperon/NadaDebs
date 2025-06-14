export function useVideoAutoplay(videoRef) {
    const canAutoplay = ref(false)

    onMounted(async () => {
        if (videoRef.value) {
            try {
                if (videoRef.value.readyState < 2) {
                    await new Promise(resolve => {
                        videoRef.value?.addEventListener('loadeddata', resolve, { once: true })
                    })
                }
                await videoRef.value.play()
                canAutoplay.value = true
            } catch {
                canAutoplay.value = false
            }
        }
    })

    return {
        canAutoplay
    }
} 