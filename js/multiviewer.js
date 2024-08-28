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