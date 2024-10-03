import { fetchAlbumById } from "./musicService.js";

document.addEventListener("DOMContentLoaded", function () {
  const audioPlayer = document.getElementById("audio-player");
  const playPauseBtn = document.getElementById("play-pause-btn");
  const progressBar = document.getElementById("progress-bar");
  const progressContainer = document.getElementById("progress-container");
  const volumeControl = document.getElementById("volume-control");
  const trackTitleElement = document.getElementById("track-title");
  const trackArtistElement = document.getElementById("artist-name");
  const albumArtwork = document.getElementById("album-art");
  const currentTimeElement = document.getElementById("current-time");
  const durationElement = document.getElementById("duration");

  const trackListElement = document.getElementById("track-list");
  const albumTitleElement = document.getElementById("album-title");
  const albumDescriptionElement = document.getElementById("album-description");
  const albumSection = document.getElementById("album-section");

  const urlParams = new URLSearchParams(window.location.search);
  let trackTitle = urlParams.get("title");
  let trackSrc = urlParams.get("src");
  let trackArtist = urlParams.get("artist");
  let trackArtwork = urlParams.get("artwork");

  const id = urlParams.get("id");

  if (id) {
    fetchAlbumById(id)
      .then((data) => {
        console.log("Album Details:", data);

        albumSection.classList.remove("hidden");

        // Set album title and description
        albumTitleElement.textContent = data.title;
        albumDescriptionElement.textContent = data.description;

        // Populate the track list
        data.songs.forEach((song) => {
          const listItem = document.createElement("li");
          listItem.innerHTML = `
    <div class="track-link" data-src="${song.stream_url}" data-title="${song.title}" data-artist="${data.artists[0].name}" data-artwork="${song.artwork_url}">
      <img src="${song.artwork_url}" alt="${song.title} Artwork" class="track-artwork" style="width: 50px; height: 50px; margin-right: 10px;"/> <!-- Add this line for artwork -->
      <span>${song.title}</span> <!-- Title displayed next to artwork -->
    </div>`;
          trackListElement.appendChild(listItem);
        });

        // Play the first song automatically
        const firstSong = data.songs[0];
        playTrack(
          firstSong.stream_url,
          firstSong.title,
          data.artists[0].name,
          firstSong.artwork_url
        );

        // Add click event listener to each track link
        const trackLinks = document.querySelectorAll(".track-link");
        trackLinks.forEach((link) => {
          link.addEventListener("click", (e) => {
            e.preventDefault();
            const songSrc = link.getAttribute("data-src");
            const songTitle = link.getAttribute("data-title");
            const songArtist = link.getAttribute("data-artist");
            const songArtwork = link.getAttribute("data-artwork");
            playTrack(songSrc, songTitle, songArtist, songArtwork);
          });
        });
      })
      .catch((error) => {
        console.error("Error fetching album details:", error);
      });
  }

  function playTrack(src, title, artist, artwork) {
    trackTitleElement.textContent = title;
    trackArtistElement.textContent = artist;
    albumArtwork.src = artwork;
    audioPlayer.src = src;

    // Update the duration once the metadata is loaded
    audioPlayer.addEventListener("loadedmetadata", function () {
      durationElement.textContent = formatTime(audioPlayer.duration);
    });

    // Auto-play the track
    audioPlayer
      .play()
      .then(() => {
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
      })
      .catch((error) => {
        console.log(
          "Playback prevented due to user interaction policy.",
          error
        );
      });
  }
  // Set track title and source if provided in URL parameters
  if (trackTitle && trackSrc && trackArtist && trackArtwork) {
    trackTitleElement.textContent = trackTitle;
    audioPlayer.src = trackSrc;
    trackArtistElement.textContent = trackArtist;
    albumArtwork.src = trackArtwork;

    // Update the duration once the metadata is loaded
    audioPlayer.addEventListener("loadedmetadata", function () {
      durationElement.textContent = formatTime(audioPlayer.duration);
    });

    audioPlayer
      .play()
      .then(() => {
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
      })
      .catch((error) => {
        console.log(
          "Playback prevented due to user interaction policy.",
          error
        );
      });
  }

  audioPlayer.addEventListener("timeupdate", updateProgress);
  progressContainer.addEventListener("click", setProgress);
  // volumeControl.addEventListener("input", setVolume);

  // Add a global keydown event listener to handle keyboard shortcuts
  document.addEventListener("keydown", handleKeyboardShortcuts);

  function updateProgress() {
    if (audioPlayer.duration) {
      const progressPercent =
        (audioPlayer.currentTime / audioPlayer.duration) * 100;
      progressBar.style.width = `${progressPercent}%`;

      // Update current time display
      currentTimeElement.textContent = formatTime(audioPlayer.currentTime);
    }
  }

  function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
  }

  volumeControl.addEventListener("input", setVolume);

  function setVolume() {
    audioPlayer.volume = volumeControl.value;
  }

  function handleKeyboardShortcuts(event) {
    switch (event.key) {
      case " ":
      case "Enter":
        event.preventDefault();
        if (audioPlayer.paused) {
          audioPlayer
            .play()
            .then(() => {
              playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            })
            .catch((error) => {
              console.log(
                "Playback prevented due to user interaction policy.",
                error
              );
            });
        } else {
          audioPlayer.pause();
          playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
        break;
      case "ArrowRight":
        event.preventDefault();
        audioPlayer.currentTime = Math.min(
          audioPlayer.currentTime + 10,
          audioPlayer.duration
        );
        break;
      case "ArrowLeft":
        event.preventDefault();
        audioPlayer.currentTime = Math.max(audioPlayer.currentTime - 10, 0);
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
      case "m":
        event.preventDefault();
        audioPlayer.muted = !audioPlayer.muted;
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

  function showVolumeControl() {
    volumeControl.style.display = "block";
    volumeControl.style.opacity = 1;

    // Hide volume control after a short delay if no further interaction
    clearTimeout(volumeControl.hideTimeout);
    volumeControl.hideTimeout = setTimeout(() => {
      volumeControl.style.opacity = 0;
      setTimeout(() => {
        volumeControl.style.display = "none";
      }, 200); // Wait for fade-out transition to complete
    }, 3000); // Hide after 3 seconds of inactivity
  }

  // Utility function to format time in minutes and seconds
  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }
});
