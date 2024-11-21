import { fetchAlbumById } from "./musicService.js";

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

  const trackListElement = document.getElementById("track-list");

  let currentControl = "playPause"; // Start by focusing on the play/pause button
  let currentTrackIndex = 0; // Track currently selected song index
  let inTracklist = false; // Tracks if we're navigating in the tracklist

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (id) {
    const albumArtwork = document.getElementById("album-art");
    const musicArtworkDiv = document.querySelector(".music-artwork");
    const albumSection = document.getElementById("album-section");
    const albumTitleElement = document.getElementById("album-title");
    const albumDescriptionElement =
      document.getElementById("album-description");
    const trackListElement = document.getElementById("track-list");

    // Show shimmer effect for artwork and track list by default
    musicArtworkDiv.classList.remove("loaded");
    albumSection.classList.add("hidden"); // Hide album section until data is loaded

    // Add shimmer placeholders for the track list
    trackListElement.innerHTML = "";
    for (let i = 0; i < 5; i++) {
      // Create 5 placeholder shimmer elements
      const placeholder = document.createElement("div");
      placeholder.classList.add("track-list-placeholder");
      trackListElement.appendChild(placeholder);
    }

    fetchAlbumById(id)
      .then((data) => {
        // Populate album section
        albumTitleElement.textContent = data.title;
        albumDescriptionElement.textContent = data.description;

        // Remove the shimmer placeholders once data is available
        trackListElement.innerHTML = ""; // Clear placeholder content

        // Populate the track list with actual data
        data.songs.forEach((song) => {
          const listItem = document.createElement("li");
          listItem.innerHTML = `
          <div class="track-link" data-src="${song.stream_url}" data-title="${song.title}" data-artist="${data.artists[0].name}" data-artwork="${song.artwork_url}">
            <img src="${song.artwork_url}" alt="${song.title} Artwork" class="track-artwork" style="width: 50px; height: 50px; margin-right: 10px;" />
            <span>${song.title}</span>
          </div>`;

          // Add event listener to play track on click
          listItem.addEventListener("click", (e) => {
            e.preventDefault();
            playTrack(
              song.stream_url,
              song.title,
              data.artists[0].name,
              song.artwork_url
            );
          });

          trackListElement.appendChild(listItem);
        });

        // Load the first song automatically if available
        const firstSong = data.songs[0];
        if (firstSong) {
          playTrack(
            firstSong.stream_url,
            firstSong.title,
            data.artists[0].name,
            firstSong.artwork_url
          );
        }

        // Once the album artwork is loaded, hide the shimmer
        albumArtwork.onload = function () {
          musicArtworkDiv.classList.add("loaded");
          // Remove the hidden class to show the album section once data is loaded
          albumSection.classList.remove("hidden");
        };

        // Add keyboard navigation
        document.addEventListener("keydown", handleKeyboardShortcuts);
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

  audioPlayer.addEventListener("timeupdate", updateProgress);
  progressContainer.addEventListener("click", setProgress);

  function updateProgress() {
    if (audioPlayer.duration) {
      const progressPercent =
        (audioPlayer.currentTime / audioPlayer.duration) * 100;
      progressBar.style.width = `${progressPercent}%`;
      currentTimeElement.textContent = formatTime(audioPlayer.currentTime);
    }
  }

  function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
  }

  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  // Handle keyboard shortcuts for navigating the player and tracklist
  function handleKeyboardShortcuts(event) {
    switch (event.key) {
      case "Enter":
        if (!inTracklist) {
          if (currentControl === "playPause") {
            togglePlayPause();
          } else if (currentControl === "prev") {
            rewindTrack();
          } else if (currentControl === "next") {
            forwardTrack();
          }
        } else {
          // Play the selected track from the tracklist
          playTrackFromList(currentTrackIndex);

          // After playing the track, return focus to playPause
          inTracklist = false;
          currentControl = "playPause";
          highlightControl();
        }
        break;

      case "ArrowRight":
        if (!inTracklist) {
          // Move from prev to playPause, then to next, then to tracklist
          if (currentControl === "prev") {
            currentControl = "playPause";
          } else if (currentControl === "playPause") {
            currentControl = "next";
          } else if (currentControl === "next") {
            currentControl = "tracklist"; // Move to tracklist
            inTracklist = true;
            currentTrackIndex = 0; // Ensure the first track is selected
            highlightTrack(); // Highlight the first track immediately
            scrollToHighlightedTrack(); // Ensure the track is visible
          }
          highlightControl();
        }
        break;

      case "ArrowLeft":
        if (!inTracklist) {
          // Move backward in the controls
          if (currentControl === "next") {
            currentControl = "playPause";
          } else if (currentControl === "playPause") {
            currentControl = "prev";
          }
          highlightControl();
        } else {
          // Move from tracklist back to controls (reset to playPause)
          inTracklist = false;
          currentControl = "playPause";
          highlightControl();
        }
        break;

      case "ArrowDown":
        if (inTracklist) {
          // Move down in the tracklist
          currentTrackIndex = Math.min(
            currentTrackIndex + 1,
            trackListElement.children.length - 1
          );
          highlightTrack();
          scrollToHighlightedTrack(); // Scroll to the selected track
        }
        break;

      case "ArrowUp":
        if (inTracklist) {
          if (currentTrackIndex === 0) {
            // Move focus back to the player controls
            inTracklist = false;
            currentControl = "playPause";
            highlightControl();
          } else {
            // Move up in the tracklist
            currentTrackIndex = Math.max(currentTrackIndex - 1, 0);
            highlightTrack();
            scrollToHighlightedTrack(); // Scroll to the selected track
          }
        }
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

    // Remove active from track list when switching to control buttons
    const trackLinks = document.querySelectorAll(".track-link");
    trackLinks.forEach((link) => link.classList.remove("active"));

    if (currentControl === "prev") {
      prevBtn.classList.add("active");
    } else if (currentControl === "playPause") {
      playPauseBtn.classList.add("active");
    } else if (currentControl === "next") {
      nextBtn.classList.add("active");
    }
  }

  // Highlight the selected track in the tracklist
  function highlightTrack() {
    const trackLinks = document.querySelectorAll(".track-link");
    trackLinks.forEach((link, index) => {
      if (index === currentTrackIndex) {
        link.classList.add("active"); // Highlight the current track
      } else {
        link.classList.remove("active");
      }
    });
  }

  // Scroll the tracklist to ensure the highlighted track is visible
  function scrollToHighlightedTrack() {
    const selectedTrack = trackListElement.children[currentTrackIndex];
    selectedTrack.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // Play the selected track from the tracklist
  function playTrackFromList(index) {
    const selectedTrack = trackListElement.children[index];
    const songSrc = selectedTrack
      .querySelector(".track-link")
      .getAttribute("data-src");
    const songTitle = selectedTrack
      .querySelector(".track-link")
      .getAttribute("data-title");
    const songArtist = selectedTrack
      .querySelector(".track-link")
      .getAttribute("data-artist");
    const songArtwork = selectedTrack
      .querySelector(".track-link")
      .getAttribute("data-artwork");

    playTrack(songSrc, songTitle, songArtist, songArtwork);

    // After playing the track, reset focus to the playPause button
    inTracklist = false;
    currentControl = "playPause";
    highlightControl();
  }

  // Toggle between play and pause states
  function togglePlayPause() {
    if (audioPlayer.paused) {
      audioPlayer.play();
      playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
      audioPlayer.pause();
      playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
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
});
