import { fetchProfileData } from "./profileService.js";

// profilePage.js
document.addEventListener("DOMContentLoaded", async () => {
  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem("userData"));
  const userID = userData?.id;

  // Display placeholders
  displayPlaceholders("movie-row");
  displayPlaceholders("tv-row");
  displayPlaceholders("songs-row");
  displayPlaceholders("radio-row");
  displayPlaceholders("podcast-row");
  displayPlaceholders("ppv-row");
  // displayPlaceholders("album-row");

  if (userID) {
    try {
      // Fetch user profile data once
      const userProfileData = await fetchProfileData(userID);
      console.log("userProfileData", userProfileData);

      // Bind data and replace placeholders
      bindUserProfileData(userProfileData);

      const movies = userProfileData?.favorite_movies;
      replacePlaceholdersWithDataVideo("movie-row", movies, "movies");

      const tvSeries = userProfileData?.favorite_tv_series;
      replacePlaceholdersWithDataVideo("tv-row", tvSeries, "series");

      const songs = userProfileData?.loved?.data;
      replacePlaceholdersWithMusicData("songs-row", songs);

      const radios = userProfileData?.favorite_radio_stations;
      replacePlaceholdersWithRadioData("radio-row", radios, "radio");

      const podcasts = userProfileData?.favorite_podcasts;
      replacePlaceholdersWithPodcastData("podcast-row", podcasts, "podcast");

      const ppvs = userProfileData?.favorite_ppv_events;
      replacePlaceholdersWithPpvData("ppv-row", ppvs, "ppv");

      // const albums = userProfileData?.albums;
      // replacePlaceholdersWithData("album-row", albums);

      // Initialize navigation only after data is loaded
      initializeMediaNavigation();
    } catch (error) {
      console.error("Failed to load media data:", error);
    }
  } else {
    // Redirect if no user data
    window.location.href = "../index.html";
  }

  // Logout functionality
  document
    .getElementById("logout-button")
    .addEventListener("click", function () {
      localStorage.removeItem("userData");
      window.location.href = "../index.html";
    });
});

function initializeMediaNavigation() {
  let selectedSectionIndex = 0;
  let selectedItemIndex = 0;
  const mediaSections = [
    {
      id: "button-container",
      leftArrow: null,
      rightArrow: null,
    },
    {
      id: "movie-row",
      leftArrow: "left-arrow-movies",
      rightArrow: "right-arrow-movies",
    },
    {
      id: "tv-row",
      leftArrow: "left-arrow-tv",
      rightArrow: "right-arrow-tv",
    },
    {
      id: "songs-row",
      leftArrow: "left-arrow-music",
      rightArrow: "right-arrow-music",
    },
    {
      id: "radio-row",
      leftArrow: "left-arrow-radio",
      rightArrow: "right-arrow-radio",
    },
    {
      id: "podcast-row",
      leftArrow: "left-arrow-podcast",
      rightArrow: "right-arrow-podcast",
    },
    {
      id: "ppv-row",
      leftArrow: "left-arrow-ppv",
      rightArrow: "right-arrow-ppv",
    },
  ];

  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowUp":
        navigateSections(-1);
        break;
      case "ArrowDown":
        navigateSections(1);
        break;
      case "ArrowLeft":
        navigateItems(-1);
        break;
      case "ArrowRight":
        navigateItems(1);
        break;
      case "Enter":
        select();
        break;
      case "Escape":
        goBack();
        break;
    }
  });

  function navigateSections(step) {
    const currentRow = document.getElementById(
      mediaSections[selectedSectionIndex].id
    );

    const currentTiles = currentRow.querySelectorAll(
      ".video-tile, .music-tile, .radio-tile, .podcast-tile, .ppv-tile"
    );

    if (currentTiles.length > 0) {
      // Remove .selected from the current tile
      currentTiles[selectedItemIndex].classList.remove("selected");
    } else if (mediaSections[selectedSectionIndex].id === "button-container") {
      // Remove .selected from the button-container's element if it has it
      const selectedButton = currentRow.querySelector(".selected");
      if (selectedButton) selectedButton.classList.remove("selected");
    }

    // Update selectedSectionIndex with wrapping logic
    selectedSectionIndex =
      (selectedSectionIndex + step + mediaSections.length) %
      mediaSections.length;

    // Reset selectedItemIndex to 0 for the new section
    selectedItemIndex = 0;

    const newRow = document.getElementById(
      mediaSections[selectedSectionIndex].id
    );

    if (mediaSections[selectedSectionIndex].id === "button-container") {
      // Apply .selected to the element inside button-container
      const button = newRow.querySelector(".logout-btn");
      if (button) button.classList.add("selected");
      scrollToTop(); // Scroll to the top for the hero section
    } else {
      // Apply .selected to the first video-tile in the new section
      const newTiles = newRow.querySelectorAll(
        ".video-tile, .music-tile, .radio-tile, .podcast-tile, .ppv-tile"
      );
      if (newTiles.length > 0) {
        newTiles[selectedItemIndex].classList.add("selected");
        scrollToSection(newRow);
        updateArrowVisibility(newRow, newTiles);
      }
    }
  }

  function navigateItems(step) {
    const currentRow = document.getElementById(
      mediaSections[selectedSectionIndex].id
    );
    const currentTiles = currentRow.querySelectorAll(
      ".video-tile, .music-tile, .radio-tile, .podcast-tile, .ppv-tile"
    );

    if (currentTiles.length > 0) {
      currentTiles[selectedItemIndex].classList.remove("selected");
      selectedItemIndex =
        (selectedItemIndex + step + currentTiles.length) % currentTiles.length;
      currentTiles[selectedItemIndex].classList.add("selected");

      scrollToTile(currentRow, currentTiles[selectedItemIndex]);
      updateArrowVisibility(currentRow, currentTiles);
    }
  }

  function select() {
    const selectedTile = document.querySelector(".selected");

    if (!selectedTile) return;

    // Check if the selected item is the logout button
    if (selectedTile.id === "logout-button") {
      // Clear local storage
      localStorage.clear();
      window.location.reload();
      return;
    }

    const videoUrl = selectedTile.getAttribute("data-url");
    const slug = selectedTile.getAttribute("data-slug");
    const mediaType = selectedTile.getAttribute("data-type");
    const title = selectedTile.getAttribute("data-title");

    const type = selectedTile.getAttribute("type");
    const albumId = selectedTile.getAttribute("id");
    const songId = selectedTile.getAttribute("song-id");
    const radio_slug = selectedTile.getAttribute("data-slug");
    const podcastId = selectedTile.getAttribute("id");
    const ppv_slug = selectedTile.getAttribute("data-slug");

    console.log(type);

    if (type === "music") {
      // Redirect to music player for individual song
      window.location.href = `musicPlayer.html?id=${encodeURIComponent(
        songId
      )}`;
      return;
    } else if (type === "album") {
      // Redirect to music player for album
      window.location.href = `musicPlayerForAlbum.html?id=${encodeURIComponent(
        albumId
      )}`;
      return;
    } else if (type === "radio") {
      window.location.href = `radioPlayer.html?slug=${encodeURIComponent(
        radio_slug
      )}`;
      return;
    } else if (type === "podcast") {
      window.location.href = `podcastPlayerForEpisode.html?id=${encodeURIComponent(
        podcastId
      )}`;
      return;
    } else if (type === "ppv") {
      window.location.href = `payperview/ppvDetailsPage.html?ppv-slug=${encodeURIComponent(
        slug
      )}`;
      return;
    }
    console.log("Selected video type:", mediaType);

    //Handle video redirection
    if (mediaType === "series") {
      window.location.href = `media/videoDetails.html?series-slug=${encodeURIComponent(
        slug
      )}`;
      return;
    } else if (mediaType === "movies") {
      window.location.href = `media/videoDetails.html?movie-slug=${encodeURIComponent(
        slug
      )}`;
      return;
    }
  }

  function scrollToSection(section) {
    section.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function scrollToTile(row, tile) {
    const tileOffset = tile.offsetLeft;
    const rowWidth = row.clientWidth;
    const tileWidth = tile.clientWidth;

    const scrollPosition = tileOffset - rowWidth / 2 + tileWidth / 2;
    row.scrollLeft = scrollPosition;
  }

  function updateArrowVisibility(row, tiles) {
    const currentSection = mediaSections[selectedSectionIndex];
    const leftArrow = currentSection.leftArrow
      ? document.getElementById(currentSection.leftArrow)
      : null;
    const rightArrow = currentSection.rightArrow
      ? document.getElementById(currentSection.rightArrow)
      : null;

    const atStart = selectedItemIndex === 0;
    const atEnd = selectedItemIndex === tiles.length - 1;

    if (leftArrow) leftArrow.style.display = atStart ? "none" : "block";
    if (rightArrow) rightArrow.style.display = atEnd ? "none" : "block";
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// Function to bind user profile data to the UI
function bindUserProfileData(userProfileData) {
  // Bind user data to the UI
  document.getElementById("cover-photo").src =
    userProfileData.artwork_url || "default-avatar.png";
  document.getElementById("profile-image").src =
    userProfileData.artwork_url || "default-avatar.png";
  document.getElementById("profile-name").textContent = userProfileData.name;
  document.getElementById("profile-bio").textContent =
    userProfileData.bio.replace(/"/g, "");
  document.getElementById("follower-count").textContent = `${
    userProfileData.follower_count
  } Follower${userProfileData.follower_count !== 1 ? "s" : ""}`;
  document.getElementById(
    "following-count"
  ).textContent = `${userProfileData.following_count} Following`;

  // Set up social links
  const instagramLink = document.getElementById("instagram-link");
  const facebookLink = document.getElementById("facebook-link");
  const websiteLink = document.getElementById("website-link");

  if (userProfileData.instagram_url) {
    instagramLink.href = `https://instagram.com/${userProfileData.instagram_url}`;
  } else {
    instagramLink.style.display = "none";
  }

  if (userProfileData.facebook_url) {
    facebookLink.href = `https://facebook.com/${userProfileData.facebook_url}`;
  } else {
    facebookLink.style.display = "none";
  }

  if (userProfileData.website_url) {
    websiteLink.href = `https://${userProfileData.website_url}`;
  } else {
    websiteLink.style.display = "none";
  }
}

function displayPlaceholders(rowId) {
  const row = document.getElementById(rowId);
  row.innerHTML = "";

  // Get the window's inner width
  const windowWidth = window.innerWidth;

  // Calculate how many placeholders can fit in the row
  const placeholderWidth = 180;
  const placeholderCount = Math.floor(windowWidth / placeholderWidth);

  // Create placeholders based on the calculated count
  for (let i = 0; i < placeholderCount; i++) {
    const placeholder = document.createElement("div");
    placeholder.classList.add("placeholder-tile");
    placeholder.innerHTML = `
      <div class="placeholder-img"></div>
      <div class="placeholder-title"></div>
    `;
    row.appendChild(placeholder);
  }
}

function replacePlaceholdersWithDataVideo(rowId, mediaItems, type) {
  const row = document.getElementById(rowId);
  row.innerHTML = "";

  mediaItems.forEach((item, index) => {
    const tile = document.createElement("div");
    tile.classList.add("video-tile");
    tile.setAttribute("data-index", index);
    tile.setAttribute("data-url", item.stream_url);
    tile.setAttribute("data-slug", item.slug);
    tile.setAttribute("data-type", type);
    tile.setAttribute("data-title", item.title || item.name);
    tile.innerHTML = `
      <div class="overlay">
        <svg class="play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" >
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>
      <img src="${item.thumbnail_url}" alt="${item.title}">
      <div class="title">${
        (item.title || item.name).length > 20
          ? (item.title || item.name).substring(0, 20) + "..."
          : item.title || item.name
      }</div>
    `;
    tile.addEventListener("click", () => {
      select();
    });
    row.appendChild(tile);
  });
}

function replacePlaceholdersWithMusicData(rowId, mediaItems, type) {
  const row = document.getElementById(rowId);
  row.innerHTML = "";

  if (Array.isArray(mediaItems)) {
    mediaItems.forEach((item, index) => {
      const tile = document.createElement("div");
      if (rowId === "music-row") {
        tile.setAttribute("type", "album");
        tile.setAttribute("id", item.id);
      } else {
        tile.setAttribute("type", "music");
        tile.setAttribute("song-id", item.id);
      }
      tile.classList.add("music-tile");
      tile.setAttribute("data-index", index);
      tile.setAttribute("data-title", item.title);
      tile.setAttribute("data-url", item.stream_url || item.url);
      tile.setAttribute("data-artist", item.artists[0].name);
      tile.setAttribute("data-artwork", item.artwork_url);
      tile.innerHTML = `
              <div class="overlay">
                <svg class="play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" >
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
                <img src="${item.artwork_url}" alt="${item.title}">
                <div class="title">${
                  (item.title || item.name).length > 25
                    ? (item.title || item.name).substring(0, 25) + "..."
                    : item.title || item.name
                }</div>
            `;
      row.appendChild(tile);
    });
  } else {
    console.error("Expected an array but received:", musicItems);
  }
}

function replacePlaceholdersWithRadioData(rowId, mediaItems, type) {
  const row = document.getElementById(rowId);
  row.innerHTML = "";

  console.log(mediaItems);

  if (Array.isArray(mediaItems)) {
    mediaItems.forEach((item, index) => {
      const tile = document.createElement("div");
      if (rowId === "radio-row") {
        tile.setAttribute("type", "radio");
        tile.setAttribute("id", item.id);
      }
      tile.classList.add("radio-tile");
      tile.setAttribute("data-index", index);
      tile.setAttribute("data-title", item.title);
      tile.setAttribute("data-url", item.stream_url);
      tile.setAttribute("data-artwork", item.artwork_url);
      tile.setAttribute("data-slug", item.slug);
      tile.innerHTML = `
              <div class="overlay">
                <svg class="play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" >
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
                <img src="${item.artwork_url}" alt="${item.title}">
                <div class="title">${
                  (item.title || item.name).length > 25
                    ? (item.title || item.name).substring(0, 25) + "..."
                    : item.title || item.name
                }</div>
            `;
      row.appendChild(tile);
    });
  } else {
    console.error("Expected an array but received:", musicItems);
  }
}

function replacePlaceholdersWithPodcastData(rowId, mediaItems, type) {
  const row = document.getElementById(rowId);
  row.innerHTML = "";

  console.log(mediaItems);

  if (Array.isArray(mediaItems)) {
    mediaItems.forEach((item, index) => {
      const tile = document.createElement("div");
      if (rowId === "podcast-row") {
        tile.setAttribute("type", "podcast");
        tile.setAttribute("id", item.id);
      }
      tile.classList.add("podcast-tile");
      tile.setAttribute("data-index", index);
      tile.setAttribute("data-title", item.title);
      tile.setAttribute("data-artwork", item.artwork_url);
      tile.setAttribute("data-slug", item.slug);
      tile.innerHTML = `
              <div class="overlay">
                <svg class="play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" >
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
                <img src="${item.artwork_url}" alt="${item.title}">
                <div class="title">${
                  (item.title || item.name).length > 25
                    ? (item.title || item.name).substring(0, 25) + "..."
                    : item.title || item.name
                }</div>
            `;
      row.appendChild(tile);
    });
  } else {
    console.error("Expected an array but received:", musicItems);
  }
}

function replacePlaceholdersWithPpvData(rowId, mediaItems, type) {
  const row = document.getElementById(rowId);
  row.innerHTML = "";

  console.log(mediaItems);

  if (Array.isArray(mediaItems)) {
    mediaItems.forEach((item, index) => {
      const tile = document.createElement("div");
      if (rowId === "ppv-row") {
        tile.setAttribute("type", "ppv");
        tile.setAttribute("id", item.id);
      }
      tile.classList.add("ppv-tile");
      tile.setAttribute("data-index", index);
      tile.setAttribute("data-title", item.title);
      tile.setAttribute("data-artwork", item.thumbnail_url);
      tile.setAttribute("data-slug", item.slug);
      tile.innerHTML = `
              <div class="overlay">
                <svg class="play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" >
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
                <img src="${item.thumbnail_url}" alt="${item.title}">
                <div class="title">${
                  (item.title || item.name).length > 25
                    ? (item.title || item.name).substring(0, 25) + "..."
                    : item.title || item.name
                }</div>
            `;
      row.appendChild(tile);
    });
  } else {
    console.error("Expected an array but received:", musicItems);
  }
}

function goBack() {
  window.history.back();
}
