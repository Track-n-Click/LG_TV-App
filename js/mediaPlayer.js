document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const videoSrc = urlParams.get("src");

  if (window.remotePlayer) {
    try {
      window.remotePlayer.unload();
    } catch (error) {
      console.warn("Failed to unload SDK player:", error);
    }
  }

  const sdkVideoElement = document.getElementById('sdk-video-element');
  if (sdkVideoElement) {
    sdkVideoElement.remove();
  }
  
  const player = videojs("my-video", {
    controls: false, // Hide the default controls
    autoplay: true, // Autoplay the video
    preload: "auto", 
    muted: true, // Mute the video to allow autoplay in most browsers
    playsinline: true, // Allow inline playback on mobile devices
    
    controlBar: {
      fullscreenToggle: false, // Hide the fullscreen button (optional)
    },
  });

  player.src({
    src: videoSrc,
    type: "application/x-mpegURL",
  });

  // Setup IMA ads (using same logic as before)
  const vastTagPreroll = "https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=";

  player.ima({
    adTagUrl: vastTagPreroll,
    showControlsForAds: true,
    debug: false,
  });

  player.ima.initializeAdDisplayContainer();

  player.ready(function() {
    player.play().catch(function(error) {
      console.error('Autoplay failed:', error);
      const playButton = document.createElement('button');
      playButton.innerText = 'Play';
      playButton.style.position = 'absolute';
      playButton.style.top = '50%';
      playButton.style.left = '50%';
      playButton.style.transform = 'translate(-50%, -50%)';
      playButton.addEventListener('click', function() {
        player.play();
        playButton.style.display = 'none';
      });
      document.body.appendChild(playButton);
    });
  });

  // Handle resizing
  function resizeVideoPlayer() {
    const aspectRatio = 16 / 9;
    const maxWidth = window.innerWidth;
    const maxHeight = maxWidth / aspectRatio;

    let newWidth, newHeight;
    if (maxHeight > window.innerHeight) {
      newHeight = window.innerHeight;
      newWidth = newHeight * aspectRatio;
    } else {
      newWidth = maxWidth;
      newHeight = newWidth / aspectRatio;
    }

    const videoElement = document.getElementById("my-video");
    videoElement.style.width = `${newWidth - 20}px`;
    videoElement.style.height = `${newHeight - 20}px`;
  }

  resizeVideoPlayer();
  window.addEventListener("resize", resizeVideoPlayer);

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
