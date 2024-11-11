import { fetchProfileData } from "./profileService.js";

// profilePage.js
document.addEventListener("DOMContentLoaded", async () => {
  // Display placeholders
  displayPlaceholders("movie-row");
  displayPlaceholders("tv-row");

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem("userData"));
  const userID = userData?.id;

  if (userID) {
    try {
      // Fetch user profile data once
      const userProfileData = await fetchProfileData(userID);
      console.log("userProfileData", userProfileData);

      // Bind data and replace placeholders
      bindUserProfileData(userProfileData);

      const movies = userProfileData?.favorite_movies;
      replacePlaceholdersWithData("movie-row", movies, "movies");

      const tvSeries = userProfileData?.favorite_tv_series;
      replacePlaceholdersWithData("tv-row", tvSeries, "series");

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

function replacePlaceholdersWithData(rowId, mediaItems, type) {
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
      <img src="${item.thumbnail_url}" alt="${item.title}">
      <div class="title">${item.title || item.name}</div>
    `;
    tile.addEventListener("click", () => {
      playSelectedVideo();
    });
    row.appendChild(tile);
  });
}

function initializeMediaNavigation() {
  let selectedSectionIndex = 0;
  let selectedItemIndex = 0;
  const mediaSections = [
    {
      id: "profile-container",
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
  ];

  // console.log(mediaSections);

  if (mediaSections.length > 0) {
    const firstRow = document.getElementById(
      mediaSections[selectedSectionIndex].id
    );
    console.log(firstRow);
    if (firstRow && firstRow.children.length > 0) {
      firstRow.children[selectedItemIndex].classList.add("selected");
    }
  }

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
        playSelectedVideo();
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
    const currentTiles = currentRow.querySelectorAll(".video-tile");

    if (currentTiles.length > 0) {
      currentTiles[selectedItemIndex].classList.remove("selected");
    }

    selectedSectionIndex =
      (selectedSectionIndex + step + mediaSections.length) %
      mediaSections.length;
    selectedItemIndex = 0;

    const newRow = document.getElementById(
      mediaSections[selectedSectionIndex].id
    );

    if (mediaSections[selectedSectionIndex].id === "profile-container") {
      scrollToTop(); // Scroll to the top for the hero section
    } else {
      const newTiles = newRow.querySelectorAll(".video-tile");
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
    const currentTiles = currentRow.querySelectorAll(".video-tile");

    if (currentTiles.length > 0) {
      currentTiles[selectedItemIndex].classList.remove("selected");
      selectedItemIndex =
        (selectedItemIndex + step + currentTiles.length) % currentTiles.length;
      currentTiles[selectedItemIndex].classList.add("selected");

      scrollToTile(currentRow, currentTiles[selectedItemIndex]);
      updateArrowVisibility(currentRow, currentTiles);
    }
  }

  function playSelectedVideo() {
    const selectedTile = document.querySelector(".video-tile.selected");
    if (!selectedTile) return;

    const videoUrl = selectedTile.getAttribute("data-url");
    const slug = selectedTile.getAttribute("data-slug");
    const mediaType = selectedTile.getAttribute("data-type");
    const title = selectedTile.getAttribute("data-title");

    console.log("Selected video type:", mediaType);

    if (mediaType === "tv") {
      window.location.href = `player.html?title=${encodeURIComponent(
        title
      )}&src=${encodeURIComponent(videoUrl)}`;
    } else if (mediaType === "movies") {
      console.log("Redirecting to video details page...");
      window.location.href = `media/videoDetails.html?movie-slug=${encodeURIComponent(
        slug
      )}`;
    } else {
      console.log("Redirecting to video details page...");
      window.location.href = `media/videoDetails.html?series-slug=${encodeURIComponent(
        slug
      )}`;
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

function goBack() {
  window.history.back();
}
