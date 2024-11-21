import { fetchRadioBySlug } from "./radioService.js";

document.addEventListener("DOMContentLoaded", function () {
  const audioPlayer = document.getElementById("audio-player");
  const playPauseBtn = document.getElementById("play-pause-btn");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const progressBar = document.getElementById("progress-bar");
  const progressContainer = document.getElementById("progress-container");
  const volumeControl = document.getElementById("volume-control");
  const trackTitleElement = document.getElementById("track-title");
  const trackArtistElement = document.getElementById("artist-name");
  const albumArtwork = document.getElementById("album-art");
  const currentTimeElement = document.getElementById("current-time");
  const durationElement = document.getElementById("duration");

  let currentControl = "playPause"; // Start by focusing on the play/pause button

  const urlParams = new URLSearchParams(window.location.search);
  let id = urlParams.get("slug");

  if (id) {
    const albumArtwork = document.getElementById("album-art");
    const musicArtworkDiv = document.querySelector(".music-artwork");

    // Show shimmer effect by default
    musicArtworkDiv.classList.remove("loaded");

    fetchRadioBySlug(id)
      .then((data) => {
        console.log(data)
        trackTitleElement.textContent = data.title;
        audioPlayer.src = data.stream_url;
        trackArtistElement.textContent = "";

        // Set the album artwork placeholder before loading
        albumArtwork.src = data.artwork_url;

        // Once the image is loaded, remove the shimmer effect
        albumArtwork.onload = function () {
          musicArtworkDiv.classList.add("loaded");
        };

        // Update the duration once the metadata is loaded
        audioPlayer.addEventListener("loadedmetadata", function () {
          durationElement.textContent = formatTime(audioPlayer.duration);
        });

        // Auto-play the track when the page loads
        audioPlayer
          .play()
          .then(() => {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>'; // Set to pause icon on play
          })
          .catch((error) => {
            console.log(
              "Playback prevented due to user interaction policy.",
              error
            );
          });

        // Initially highlight the play button
        highlightControl();
      })
      .catch((error) => {
        console.error("Error fetching album details:", error);
      });
  }

  // Listen for the play and pause events to update the button icon accordingly
  audioPlayer.addEventListener("play", () => {
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>'; // When the audio plays, show the pause icon
  });

  audioPlayer.addEventListener("pause", () => {
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>'; // When the audio pauses, show the play icon
  });

  // Add keyboard navigation
  document.addEventListener("keydown", handleKeyboardShortcuts);

  function handleKeyboardShortcuts(event) {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        if (currentControl === "playPause") {
          togglePlayPause(); // Handle play/pause toggle
        } else if (currentControl === "prev") {
          rewindTrack();
        } else if (currentControl === "next") {
          forwardTrack();
        }
        break;
      case "ArrowRight":
        event.preventDefault();
        if (currentControl === "playPause") {
          currentControl = "next";
        } else if (currentControl === "prev") {
          currentControl = "playPause";
        }
        highlightControl();
        break;
      case "ArrowLeft":
        event.preventDefault();
        if (currentControl === "playPause") {
          currentControl = "prev";
        } else if (currentControl === "next") {
          currentControl = "playPause";
        }
        highlightControl();
        break;
      case "ArrowUp":
        showVolumeControl();
        audioPlayer.volume = Math.min(audioPlayer.volume + 0.1, 1);
        volumeControl.value = audioPlayer.volume;
        break;
      case "ArrowDown":
        showVolumeControl();
        audioPlayer.volume = Math.max(audioPlayer.volume - 0.1, 0);
        volumeControl.value = audioPlayer.volume;
        break;
      case "Escape":
        event.preventDefault();
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          window.history.back();
        }
        break;
    }
  }

  // Highlight the currently selected control (prev, playPause, next)
  function highlightControl() {
    prevBtn.classList.remove("active");
    playPauseBtn.classList.remove("active");
    nextBtn.classList.remove("active");

    if (currentControl === "prev") {
      prevBtn.classList.add("active");
    } else if (currentControl === "playPause") {
      playPauseBtn.classList.add("active");
    } else if (currentControl === "next") {
      nextBtn.classList.add("active");
    }
  }

  // Toggle between play and pause states
  function togglePlayPause() {
    if (audioPlayer.paused) {
      audioPlayer.play(); // This will trigger the play event listener to change the icon
    } else {
      audioPlayer.pause(); // This will trigger the pause event listener to change the icon
    }
    currentControl = "playPause";
    highlightControl();
  }

  function rewindTrack() {
    audioPlayer.currentTime = Math.max(audioPlayer.currentTime - 10, 0);
  }

  function forwardTrack() {
    audioPlayer.currentTime = Math.min(
      audioPlayer.currentTime + 10,
      audioPlayer.duration
    );
  }

  // audioPlayer.addEventListener("timeupdate", updateProgress);
  progressContainer.addEventListener("click", setProgress);

  // function updateProgress() {
  //   if (audioPlayer.duration) {
  //     const progressPercent =
  //       (audioPlayer.currentTime / audioPlayer.duration) * 100;
  //     progressBar.style.width = `${progressPercent}%`;
  //     currentTimeElement.textContent = formatTime(audioPlayer.currentTime);
  //   }
  // }

  function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
  }

  function showVolumeControl() {
    volumeControl.style.display = "block";
    volumeControl.style.opacity = 1;

    clearTimeout(volumeControl.hideTimeout);
    volumeControl.hideTimeout = setTimeout(() => {
      volumeControl.style.opacity = 0;
      setTimeout(() => {
        volumeControl.style.display = "none";
      }, 200);
    }, 3000);
  }

  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }
});
