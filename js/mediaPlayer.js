import {
  fetchSeriesDetailsByStreamKey,
  fetchVideoDetailsBySlug,
  fetchSeriesDetailsBySlug,
} from "./mediaService.js";

document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const movieSlug = urlParams.get("movie-slug");
  const seriesSlug = urlParams.get("series-slug");
  // Extract the video source from the parameters
  const src = urlParams.get("src");
  const movieSrc = urlParams.get("movie-src");
  const seriesSrc = urlParams.get("series-src");
  const ppvSrc = urlParams.get("ppv-src");

  let videoDetails = null;

  if (window.remotePlayer) {
    try {
      window.remotePlayer.unload();
    } catch (error) {
      console.warn("Failed to unload SDK player:", error);
    }
  }
  //  save add details
  let vastUrl = null;
  let poster = null;
  let vastEnabled = null;
  let vastPreroll = null;
  let vastDuration = null;

  if (movieSlug) {
    videoDetails = await fetchVideoDetailsBySlug(movieSlug);
    console.log("movie", videoDetails);
  } else if (seriesSlug) {
    videoDetails = await fetchSeriesDetailsBySlug(seriesSlug);
    console.log("series", videoDetails);
  }

  if (videoDetails != null) {
    // vastUrl = videoDetails.vast_tag_url;
    vastUrl =
      "https://ayotising.com/fc.php?script=rmVideo&zoneid=59&format=vast3 ";
    poster = videoDetails.poster;
    vastEnabled = true;
    vastPreroll = videoDetails.pre_ad;
    vastDuration = videoDetails.duration;
  }
  console.log(vastUrl, poster, vastEnabled, vastPreroll, vastDuration);

  const sdkVideoElement = document.getElementById("sdk-video-element");
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
  var vastTagPreroll = vastUrl;
  var vastTagMidroll = vastUrl;
  var vastTagPostroll = vastUrl;
  var prerollTriggered = vastPreroll;
  var postrollTriggered = ppvSrc ? false : true;
  var midrollRequested = false;
  var midrollInterval = vastDuration * 60;
  var lastMidrollTime = 0;
  function initializePlayer(videoSrc) {
    console.log("Initializing player with video source:", videoSrc);
    if (vastEnabled && !ppvSrc) {
      //console.log("Video.js player initialized");

      if (!prerollTriggered) {
        player.src(videoSrc);
        // console.log('if', prerollTriggered);
        player.ima({
          adTagUrl: "",
          showControlsForAds: true,
          debug: false,
        });
        player.play();
      } else {
        // console.log('Else', prerollTriggered);
        player.ima({
          adTagUrl: vastTagPreroll,
          showControlsForAds: true,
          debug: false,
        });
        player.src(videoSrc);
        player.play();
      }
      //console.log('IMA settings configured');
      player.ima.initializeAdDisplayContainer();
      //console.log('IMA ad display container initialized');
      function requestMidrollAd() {
        midrollRequested = true;
        player.ima.changeAdTag(vastTagMidroll);
        player.ima.requestAds();
      }
      player.on("timeupdate", function () {
        var currentTime = player.currentTime();
        //console.log('Current time:', currentTime);
        var timeSinceLastMidroll = currentTime - lastMidrollTime;
        //console.log(timeSinceLastMidroll);
        if (timeSinceLastMidroll >= midrollInterval && !midrollRequested) {
          lastMidrollTime = currentTime; // Update the last mid-roll ad time
          ///console.log('Midroll triggered');
          requestMidrollAd();
        }
      });
      player.on("ended", function () {
        //console.log('Video ended');
        if (!postrollTriggered) {
          postrollTriggered = true;
          //console.log('Postroll triggered');
          player.ima.requestAds({
            adTagUrl: vastTagPostroll,
          });
          //console.log('Postroll ads requested');
        }
      });
      player.on("adsready", function () {
        if (midrollRequested) {
          //console.log('Ads ready - midroll');
        } else {
          //console.log('Ads ready - preroll');
          player.src(videoSrc);
          player.play();
        }
      });
      player.on("aderror", function () {
        //console.log('Ads aderror');
        player.play();
      });
      player.on("adend", function () {
        if (lastMidrollTime > 0) {
          //console.log('A midroll ad has finished playing.');
          midrollRequested = false;
        } else {
          //console.log('The preroll ad has finished playing.');
          prerollTriggered = true;
        }
        //console.log('ad ended');
        player.play();
      });
    } else {
      player.src(videoSrc);
      player.poster(poster);
      player.play();
    }
  }

  // Determine the actual video source to use
  let videoSrc = src || movieSrc; // Use `let` to allow reassignment

  if (seriesSrc) {
    fetchSeriesDetailsByStreamKey(seriesSrc)
      .then((data) => {
        console.log("Series Details:", data);
        videoSrc = data.url; // Update videoSrc with the URL from fetched data
        // Now you can safely use videoSrc to initialize the player
        initializePlayer(videoSrc);
      })
      .catch((error) => {
        console.error("Error fetching series details:", error);
      });
  } else if (videoSrc) {
    console.log("Video Source URL:", videoSrc);
    initializePlayer(videoSrc); // Directly initialize player if src or movie-src is present
  } else if (ppvSrc) {
    console.log("PPV Source URL:", ppvSrc);
    initializePlayer(ppvSrc);
  } else {
    console.error("No video source found in URL parameters.");
  }

  // Function to initialize video player

  // Setup IMA ads
  // const vastTagPreroll = "https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=";

  // player.ima({
  //   adTagUrl: vastTagPreroll,
  //   showControlsForAds: true,
  //   debug: false,
  // });

  // player.ima.initializeAdDisplayContainer();

  player.ready(function () {
    player.play().catch(function (error) {
      console.error("Autoplay failed:", error);
      const playButton = document.createElement("button");
      playButton.innerText = "Play";
      playButton.style.position = "absolute";
      playButton.style.top = "50%";
      playButton.style.left = "50%";
      playButton.style.transform = "translate(-50%, -50%)";
      playButton.addEventListener("click", function () {
        player.play();
        playButton.style.display = "none";
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
    if (!midrollRequested && !postrollTriggered) {
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
    }
  });
});
