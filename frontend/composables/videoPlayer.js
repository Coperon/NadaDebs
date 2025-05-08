// Composables are functions that encapsulate reactive logic or that contains logic that could potentially cause side effects/reactions in the application.
// They can be reused across multiple components.
// This is the global videoPlayer composable that will be used to play and pause videos, autoplay relative to viewport, etc.

export function playVideo(video) {
    if (video) {
        // play promise
        const playPromise = video.play()
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    // Automatic playback started!
                })
                .catch(() => {
                    // Automatic playback failed.
                    // Show a UI element to let the user manually start playback.
                })
        }
    }
}

export function pauseVideo(video) {
    if (video) {
        // pause promise
        const pausePromise = video.pause()
        if (pausePromise !== undefined) {
            pausePromise
                .then(() => {
                    // Automatic pause started!
                })
                .catch(() => {
                    // Automatic pause failed.
                    // Show a UI element to let the user manually start pause.
                })
        }
    }
}

function observeVideo(video, observer) {}
