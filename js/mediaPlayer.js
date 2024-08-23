document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const videoTitle = urlParams.get("title");
    const videoSrc = urlParams.get("src");

    const player = videojs("my-video", {
        controls: false, // Hide the default controls
        autoplay: true,  // Autoplay the video
        preload: 'auto',
        controlBar: {
            fullscreenToggle: false, // Hide the fullscreen button (optional)
        }
    });

    player.src({
        src: videoSrc,
        type: "application/x-mpegURL"
    });

    // Setup IMA ads (using same logic as before)
    const vastTagPreroll = "https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=";

    player.ima({
        adTagUrl: vastTagPreroll,
        showControlsForAds: true,
        debug: false,
    });

    player.ima.initializeAdDisplayContainer();

    // Handle Keyboard Shortcuts
    document.addEventListener("keydown", function (event) {
        switch (event.key) {
            case "Enter":
            case " ":
            case "Spacebar":
                event.preventDefault();
                player.paused() ? player.play() : player.pause();
                break;
            case "ArrowRight":
                event.preventDefault();
                player.currentTime(player.currentTime() + 10);
                break;
            case "ArrowLeft":
                event.preventDefault();
                player.currentTime(player.currentTime() - 10);
                break;
            case "ArrowUp":
                event.preventDefault();
                player.volume(Math.min(player.volume() + 0.1, 1));
                break;
            case "ArrowDown":
                event.preventDefault();
                player.volume(Math.max(player.volume() - 0.1, 0));
                break;
            case "m":
                event.preventDefault();
                player.muted(!player.muted());
                break;
            case "f":
                event.preventDefault();
                player.requestFullscreen();
                break;
            case "Escape":
                event.preventDefault();
                if (player.isFullscreen()) {
                    player.exitFullscreen();
                } else {
                    window.history.back();
                }
                break;
        }
    });
});
