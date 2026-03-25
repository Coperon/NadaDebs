export function useVideoAutoplay(videoRef) {
    const canAutoplay = ref(false)
    const attemptCount = ref(0)
    const maxAttempts = 5
    let cancelled = false

    const tryAutoplay = async () => {
        const videoEl = videoRef.value
        if (!videoEl || cancelled) return

        // If it's already playing, keep the UI unblocked.
        if (!videoEl.paused && !videoEl.ended && videoEl.readyState >= 2) {
            canAutoplay.value = true
            return
        }

        try {
            attemptCount.value++

            if (videoEl.readyState < 2) {
                await new Promise(resolve => {
                    videoEl?.addEventListener('loadeddata', resolve, { once: true })
                })
            }

            await videoEl.play()
            canAutoplay.value = true
        } catch {
            canAutoplay.value = false
        }

        // Retry a few times; autoplay may fail initially and succeed later.
        if (!canAutoplay.value && attemptCount.value < maxAttempts) {
            const delayMs = 300 * Math.pow(2, attemptCount.value - 1)
            setTimeout(() => {
                if (!cancelled && !canAutoplay.value) tryAutoplay()
            }, delayMs)
        }
    }

    onMounted(() => {
        tryAutoplay()
    })

    // Handle cases where the <video> element isn't rendered yet
    // (e.g., when portrait/mobile media is chosen after matchMedia updates).
    watch(
        () => videoRef.value,
        (el, prev) => {
            if (!el || el === prev) return
            attemptCount.value = 0
            canAutoplay.value = false
            tryAutoplay()
        },
        { flush: 'post' }
    )

    // Handle reactive src changes.
    watch(
        () => videoRef.value?.src,
        (src, prev) => {
            if (!src || src === prev) return
            attemptCount.value = 0
            canAutoplay.value = false
            tryAutoplay()
        },
        { flush: 'post' }
    )

    onBeforeUnmount(() => {
        cancelled = true
    })

    return {
        canAutoplay
    }
} 