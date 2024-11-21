import { fetchSeriesDetailsByStreamKey } from "./mediaService.js";

document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const encodedData = urlParams.get("data");
  console.log(encodedData);

  if (encodedData) {
    try {
      const decodedQueryString = atob(encodedData);
      console.log("Decoded Query String:", decodedQueryString);
      const params = new URLSearchParams(decodedQueryString);
      console.log("URL Parameters:", params);
      
      const movieSlug = params.get("movie-slug");
      const seriesSlug = params.get("series-slug");
      const src = params.get("src");
      const movieSrc = params.get("movie-src");
      const seriesSrc = params.get("series-src");
      const ppvSrc = params.get("ppv-src");
      const vastTagUrl = params.get("vast-tag") || "";
      const vastDuration =  5; // in minutes

      // Clean up any existing remote player
      if (window.remotePlayer) {
        try {
          window.remotePlayer.unload();
        } catch (error) {
          console.warn("Failed to unload SDK player:", error);
        }
      }

      const sdkVideoElement = document.getElementById("sdk-video-element");
      if (sdkVideoElement) {
        sdkVideoElement.remove();
      }

      // Initialize Video.js player with muted set to true for autoplay compliance
      const player = videojs("my-video", {
        controls: true,
        autoplay: true,
        preload: "auto",
        muted: true, // Ensure the video is muted for autoplay
        playsinline: true,
        controlBar: {
          fullscreenToggle: true,
        },
        playbackRates: [0.5, 1, 1.5, 2],
        responsive: true,
        fluid: true,
      });

      /**
       * Function to display a play button when autoplay fails
       */
      function showPlayButton() {
        // Check if the play button already exists to prevent duplicates
        if (document.getElementById("play-button")) return;

        const playButton = document.createElement("button");
        playButton.id = "play-button";
        playButton.innerText = "Play";
        playButton.style.position = "absolute";
        playButton.style.top = "50%";
        playButton.style.left = "50%";
        playButton.style.transform = "translate(-50%, -50%)";
        playButton.style.padding = "10px 20px";
        playButton.style.fontSize = "16px";
        playButton.style.zIndex = "9999";
        playButton.style.cursor = "pointer";

        playButton.addEventListener("click", function () {
          player.play();
          playButton.style.display = "none";
        });

        document.body.appendChild(playButton);
      }

      /**
       * Function to initialize the Video.js player with ads
       * @param {string} videoSrc - The source URL of the video
       */
      function initializePlayer(videoSrc) {
        console.log("Initializing player with video source:", videoSrc);
        player.src({
          src: videoSrc,
          type: "application/x-mpegURL",
        });

        player.ready(function () {
          if (vastTagUrl) {
            console.log("VAST Tag URL:", vastTagUrl);

            // Initialize the IMA plugin
            player.ima({
              adTagUrl: vastTagUrl,
              showControlsForAds: true,
              debug: false,
            });

            // Initialize the Ad Display Container before requesting ads
            player.ima.initializeAdDisplayContainer();

            // Request the preroll ads
            player.ima.requestAds();

            // Handle ads ready event
            player.on('adsready', function () {
              console.log('Ads are ready to play.');
              // Removed player.play() to let IMA handle ad playback
            });

            // Handle ad errors by resuming content
            player.on('aderror', function () {
              console.warn('Ad error occurred. Attempting to play content.');
              player.play().catch(function (error) {
                console.error('Playback failed after ad error:', error);
                showPlayButton();
              });
            });

            player.on('adserror', function () {
              console.warn('Adserror occurred. Attempting to play content.');
              player.play().catch(function (error) {
                console.error('Playback failed after adserror:', error);
                showPlayButton();
              });
            });

            // Handle ad end by resuming content
            player.on('adend', function () {
              console.log('Ad ended. Resuming content.');
              player.play().catch(function (error) {
                console.error('Playback failed after ad ended:', error);
                showPlayButton();
              });
            });

            // Handle content resume requested event
            player.on('contentresumerequested', function () {
              console.log('Content resume requested.');
              player.play().catch(function (error) {
                console.error('Playback failed after content resume requested:', error);
                showPlayButton();
              });
            });

            // Handle ads complete event to ensure content plays after all ads
            player.on('adscomplete', function () {
              console.log('All ads have completed. Playing content.');
              player.play().catch(function (error) {
                console.error('Playback failed after all ads completed:', error);
                showPlayButton();
              });
            });

            // Handle midroll ads
            let midrollRequested = false;
            const midrollInterval = vastDuration * 60; // in seconds
            let lastMidrollTime = 0;

            player.on('timeupdate', function () {
              const currentTime = player.currentTime();
              const timeSinceLastMidroll = currentTime - lastMidrollTime;

              if (timeSinceLastMidroll >= midrollInterval && !midrollRequested && !player.ads.isAdPlaying()) {
                lastMidrollTime = currentTime;
                midrollRequested = true;
                console.log('Midroll ad triggered.');
                requestMidrollAd();
              }
            });

            /**
             * Function to request midroll ads
             */
            function requestMidrollAd() {
              console.log('Requesting midroll ad.');
              player.ima.changeAdTag(vastTagUrl); // Use the same VAST tag or different if needed
              player.ima.requestAds();
            }

            /**
             * Event: ended
             * Triggered when the content video ends
             */
            player.on('ended', function () {
              console.log('Content video ended. Triggering postroll ad.');
              player.ima.changeAdTag(vastTagUrl); // Use the same VAST tag or different if needed
              player.ima.requestAds();
            });
          } else {
            // No VAST tag provided; play content directly
            console.log("No VAST tag URL provided. Playing content directly.");
            player.play().catch(function (error) {
              console.error("Autoplay failed:", error);
              showPlayButton();
            });
          }
        });
      }

      /**
       * Determine the video source and initialize the player
       */
      let videoSrc = src || movieSrc;

      if (seriesSrc) {
        fetchSeriesDetailsByStreamKey(seriesSrc)
          .then((data) => {
            console.log("Series Details:", data);
            videoSrc = data.url; // Update videoSrc with the URL from fetched data
            initializePlayer(videoSrc);
          })
          .catch((error) => {
            console.error("Error fetching series details:", error);
            showPlayButton(); // Optional: Show play button if fetching fails
          });
      } else if (videoSrc) {
        console.log("Video Source URL:", videoSrc);
        initializePlayer(videoSrc);
      } else if (ppvSrc) {
        console.log("PPV Source URL:", ppvSrc);
        initializePlayer(ppvSrc);
      } else {
        console.error("No video source found in URL parameters.");
        showPlayButton(); // Optional: Show play button if no source is found
      }

      /**
       * Function to handle resizing of the video player
       */
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
        if (videoElement) {
          videoElement.style.width = `${newWidth - 20}px`;
          videoElement.style.height = `${newHeight - 20}px`;
        }
      }

      // Initial resize and adding event listener for window resize
      resizeVideoPlayer();
      window.addEventListener("resize", resizeVideoPlayer);

      /**
       * Handle Keyboard Shortcuts for Player Controls
       */
      document.addEventListener("keydown", function (event) {
        switch (event.key) {
          case "Enter":
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
    } catch (error) {
      console.error("Error decoding data parameter:", error);
    }
  } else {
    console.error("No data parameter found in URL.");
  }
});
