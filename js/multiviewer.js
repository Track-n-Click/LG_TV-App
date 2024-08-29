document.addEventListener("DOMContentLoaded", () => {
    const videoPlayers = document.querySelectorAll(".vp");
    let currentIndex = 0;

    if (videoPlayers.length > 0) {
        // Initially focus on the first video player
        videoPlayers[currentIndex].classList.add("video-active");
        updateTitle(videoPlayers[currentIndex]);
    }

    document.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "ArrowRight":
                navigate(1);
                break;
            case "ArrowLeft":
                navigate(-1);
                break;
            case "ArrowDown":
                navigateRow(1);
                break;
            case "ArrowUp":
                navigateRow(-1);
                break;
            case "Enter":
                togglePlayPause();
                break;
            case "Escape":
                goBack();
                break;
        }
    });

    function navigate(step) {
        if (videoPlayers.length > 0) {
            videoPlayers[currentIndex].classList.remove("video-active");
            currentIndex = (currentIndex + step + videoPlayers.length) % videoPlayers.length;
            videoPlayers[currentIndex].classList.add("video-active");
            videoPlayers[currentIndex].scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            updateTitle(videoPlayers[currentIndex]);
        }
    }

    function navigateRow(step) {
        const cols = getNumberOfColumns();
        if (videoPlayers.length > 0 && cols > 0) {
            videoPlayers[currentIndex].classList.remove("video-active");
            const newIndex = currentIndex + step * cols;
            if (newIndex >= 0 && newIndex < videoPlayers.length) {
                currentIndex = newIndex;
            } else {
                // Wrap around if at the edge of the grid
                currentIndex = step > 0 ? Math.min(videoPlayers.length - 1, currentIndex + cols) : Math.max(0, currentIndex - cols);
            }
            videoPlayers[currentIndex].classList.add("video-active");
            videoPlayers[currentIndex].scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            updateTitle(videoPlayers[currentIndex]);
        }
    }

    function updateTitle(player) {
        const titleElement = player.querySelector(".title");
        if (titleElement) {
            document.getElementById("game-title").textContent = titleElement.textContent;
        }
    }

    function getNumberOfColumns() {
        const playerWidth = videoPlayers[0].offsetWidth;
        const gridWidth = document.querySelector(".grid").offsetWidth;
        return Math.floor(gridWidth / playerWidth);
    }

    function togglePlayPause() {
        const selectedPlayer = videoPlayers[currentIndex].querySelector("video");

        if (selectedPlayer) {
            if (document.fullscreenElement) {
                // Exit full-screen mode
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) { /* Firefox */
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { /* IE/Edge */
                    document.msExitFullscreen();
                }

                // Mute the video when exiting full-screen
                selectedPlayer.muted = true;
            } else {
                // Enter full-screen mode
                if (selectedPlayer.requestFullscreen) {
                    selectedPlayer.requestFullscreen();
                } else if (selectedPlayer.mozRequestFullScreen) { /* Firefox */
                    selectedPlayer.mozRequestFullScreen();
                } else if (selectedPlayer.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                    selectedPlayer.webkitRequestFullscreen();
                } else if (selectedPlayer.msRequestFullscreen) { /* IE/Edge */
                    selectedPlayer.msRequestFullscreen();
                }

                // Ensure the video is not muted when entering full-screen
                selectedPlayer.muted = false;
            }
        }
    }

    // Handle fullscreen changes
    document.addEventListener("fullscreenchange", () => {
        if (!document.fullscreenElement) {
            // When exiting full-screen mode, mute the video
            const selectedPlayer = videoPlayers[currentIndex].querySelector("video");
            if (selectedPlayer) {
                selectedPlayer.muted = true;
            }
        }
    });
    document.addEventListener("webkitfullscreenchange", () => {
        if (!document.webkitFullscreenElement) {
            // When exiting full-screen mode, mute the video
            const selectedPlayer = videoPlayers[currentIndex].querySelector("video");
            if (selectedPlayer) {
                selectedPlayer.muted = true;
            }
        }
    });
    document.addEventListener("mozfullscreenchange", () => {
        if (!document.mozFullScreenElement) {
            // When exiting full-screen mode, mute the video
            const selectedPlayer = videoPlayers[currentIndex].querySelector("video");
            if (selectedPlayer) {
                selectedPlayer.muted = true;
            }
        }
    });
    document.addEventListener("MSFullscreenChange", () => {
        if (!document.msFullscreenElement) {
            // When exiting full-screen mode, mute the video
            const selectedPlayer = videoPlayers[currentIndex].querySelector("video");
            if (selectedPlayer) {
                selectedPlayer.muted = true;
            }
        }
    });

    function goBack() {
        window.history.back();
    }
});




const videoData = {
    "row0": [
      { "id": "vpleft", "title": "MILITARY TV", "manifest": "https://cdn.rtmp1.vodhosting.com/hls/MilitaryChannel.m3u8", "type": "hls" },
      { "id": "vpright", "title": "AYO MUSIC", "manifest": "https://cdn.rtmp1.vodhosting.com/hls/AYO.m3u8", "type": "hls" }
    ],
    "row1": [
      { "id": "vp00", "title": "SERENDIB TV", "manifest": "https://cdn.rtmp1.vodhosting.com/hls/SerendibTV.m3u8", "type": "hls" },
      { "id": "vp01", "title": "Ultimate Strength Network", "manifest": "https://cdn.rtmp1.vodhosting.com/hls/Strongman.m3u8", "type": "hls" },
      { "id": "vp02", "title": "RMT TV", "manifest": "https://cdn.rtmp1.vodhosting.com/hls/RMTTV.m3u8", "type": "hls" },
      { "id": "vp03", "title": "AYOZAT FIGHT NETWORK", "manifest": "https://cdn.rtmp1.vodhosting.com/hls/AFN.m3u8", "type": "hls" }
    ],
    "row2": [
      { "id": "vp10", "title": "Nub TV", "manifest": "https://cdn.rtmp1.vodhosting.com/hls/NubTV.m3u8", "type": "hls" },
      { "id": "vp11", "title": "Collectables Guru", "manifest": "https://cdn.rtmp1.vodhosting.com/hls/CollectableGurus.m3u8", "type": "hls" },
      { "id": "vp12", "title": "AYOZAT TV", "manifest": "https://cdn.rtmp1.vodhosting.com/hls/AyozatTV.m3u8", "type": "hls" },
      { "id": "vp13", "title": "AYO SPORT", "manifest": "https://cdn.rtmp1.vodhosting.com/hls/AYOSPORT.m3u8", "type": "hls" }
    ]
  };

  // Function to initialize video.js players
  function initializeVideos() {
    Object.keys(videoData).forEach(row => {
      videoData[row].forEach(video => {
        const player = videojs(video.id, {
          autoplay: true,
          muted: true,
          controls: false // Disable controls to prevent interference
        });
        
        player.src({
          src: video.manifest,
          type: 'application/x-mpegURL'
        });

        // Set video title
        document.getElementById(`${video.id}-title`).textContent = video.title;
      });
    });
  }

  // Initialize videos after the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', initializeVideos);

  
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "Escape":
        goBack();
        break;
    }
  });

  function goBack() {
    window.history.back();
  }