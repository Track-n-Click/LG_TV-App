document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const trackTitle = urlParams.get("title");
  const trackSrc = urlParams.get("src");

  const trackTitleElement = document.getElementById("track-title");
  const audioPlayer = document.getElementById("audio-player");

  if (trackTitle && trackSrc) {
    trackTitleElement.textContent = trackTitle;
    audioPlayer.src = trackSrc;

    // Auto-play the track when the page loads
    audioPlayer.play();
  }

  // Handle Keyboard Shortcuts
  document.addEventListener("keydown", function (event) {
    switch (event.key) {
      case " ":
      case "Enter":
        event.preventDefault();
        if (audioPlayer.paused) {
          audioPlayer.play();
        } else {
          audioPlayer.pause();
        }
        break;
      case "ArrowRight": // Fast forward 10 seconds
        event.preventDefault();
        audioPlayer.currentTime = Math.min(
          audioPlayer.currentTime + 10,
          audioPlayer.duration
        );
        break;
      case "ArrowLeft": // Rewind 10 seconds
        event.preventDefault();
        audioPlayer.currentTime = Math.max(audioPlayer.currentTime - 10, 0);
        break;
      case "ArrowUp": // Increase volume
        event.preventDefault();
        audioPlayer.volume = Math.min(audioPlayer.volume + 0.1, 1);
        break;
      case "ArrowDown": // Decrease volume
        event.preventDefault();
        audioPlayer.volume = Math.max(audioPlayer.volume - 0.1, 0);
        break;
      case "m": // Mute/Unmute
        event.preventDefault();
        audioPlayer.muted = !audioPlayer.muted;
        break;
      case "f": // Fullscreen (for future enhancements if video player added)
        event.preventDefault();
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else if (audioPlayer.requestFullscreen) {
          audioPlayer.requestFullscreen();
        }
        break;
      case "Escape": // Exit fullscreen or go back
        event.preventDefault();
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          window.history.back();
        }
        break;
    }
  });
});
