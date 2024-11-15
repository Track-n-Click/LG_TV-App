import { fetchLatestPodcasts, fetchAllPodcast } from "./podcastService.js";

document.addEventListener("DOMContentLoaded", async () => {
  displayPlaceholders("latest-podcast-channels-row");
  displayPlaceholders("podcast-all-row");

  setTimeout(async () => {
    const latestPodcast = await fetchLatestPodcasts();
    replacePlaceholdersWithData("latest-podcast-channels-row", latestPodcast);

    const allPodcasts = await fetchAllPodcast();
    replacePlaceholdersWithData("podcast-all-row", allPodcasts);
  }, 1000);

  initializeMusicNavigation();
});

function displayPlaceholders(rowId) {
  const row = document.getElementById(rowId);
  if (!row) {
    console.error(`Element with ID '${rowId}' not found.`);
    return;
  }
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

function replacePlaceholdersWithData(rowId, podcast) {
  const row = document.getElementById(rowId);
  row.innerHTML = "";

  if (Array.isArray(podcast)) {
    podcast.forEach((item, index) => {
      const tile = document.createElement("div");
      tile.setAttribute("type", "podcast");
      tile.setAttribute("podcast-id", item.id);
      tile.classList.add("music-tile");
      tile.setAttribute("data-index", index);
      tile.setAttribute("data-title", item.title);
      tile.setAttribute("data-url", item.stream_url || item.url);
      tile.setAttribute("data-artist", "test");
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
    console.error("Expected an array but received:", podcast);
  }
}

function initializeMusicNavigation() {
  let selectedSectionIndex = 0;
  let selectedItemIndex = 0;
  const musicSections = [
    // "hero-container",
    // "latest-radio-channels-row",
    // "radio-you-might-like-row",
    // "most-played-songs-row",
    {
      id: "hero-container",
      leftArrow: null,
      rightArrow: null,
    },
    {
      id: "latest-podcast-channels-row",
      leftArrow: "left-arrow-podcast",
      rightArrow: "right-arrow-podcast",
    },
    {
      id: "podcast-all-row",
      leftArrow: "left-arrow-all-podcast",
      rightArrow: "right-arrow-all-podcast",
    },
  ];

  if (musicSections.length > 0) {
    const firstRow = document.getElementById(
      musicSections[selectedSectionIndex]
    );
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
        playSelectedMusic();
        break;
      case "Escape":
        goBack();
        break;
    }
  });

  function navigateSections(step) {
    const currentRow = document.getElementById(
      musicSections[selectedSectionIndex].id
    );
    const currentTiles = currentRow.querySelectorAll(".music-tile");

    if (currentTiles.length > 0) {
      currentTiles[selectedItemIndex].classList.remove("selected");
    }

    selectedSectionIndex =
      (selectedSectionIndex + step + musicSections.length) %
      musicSections.length;
    selectedItemIndex = 0; // Reset item index to 0 when moving to a new section

    const newRow = document.getElementById(
      musicSections[selectedSectionIndex].id
    );

    if (musicSections[selectedSectionIndex].id === "hero-container") {
      scrollToTop(); // Scroll to the top for the hero section
    } else {
      const newTiles = newRow.querySelectorAll(".music-tile");

      if (newTiles.length > 0) {
        newTiles[selectedItemIndex].classList.add("selected");
        scrollToSection(newRow);
        updateArrowVisibility(newRow, newTiles);
      }
    }
  }

  function navigateItems(step) {
    const currentRow = document.getElementById(
      musicSections[selectedSectionIndex].id
    );
    const currentTiles = currentRow.querySelectorAll(".music-tile");

    if (currentTiles.length > 0) {
      currentTiles[selectedItemIndex].classList.remove("selected");
      selectedItemIndex =
        (selectedItemIndex + step + currentTiles.length) % currentTiles.length;
      currentTiles[selectedItemIndex].classList.add("selected");

      scrollToTile(currentRow, currentTiles[selectedItemIndex]);
      updateArrowVisibility(currentRow, currentTiles); // Updated here
    }
  }

  function playSelectedMusic() {
    const selectedTile = document.querySelector(".music-tile.selected");
    const musicUrl = selectedTile.getAttribute("data-url");
    const musicTitle = selectedTile.getAttribute("data-title");
    const musicArtist = selectedTile.getAttribute("data-artist");
    const musicArtwork = selectedTile.getAttribute("data-artwork");
    const type = selectedTile.getAttribute("type");
    const albumId = selectedTile.getAttribute("podcast-id");
    const songId = selectedTile.getAttribute("radio-id");
    const radio_slug = selectedTile.getAttribute("data-slug");

    if (type === "podcast") {
      window.location.href = `podcastPlayerForEpisode.html?id=${encodeURIComponent(
        albumId
      )}`;
    }
  }

  function updateArrowVisibility(row, tiles) {
    const currentSection = musicSections[selectedSectionIndex];
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

  function scrollToTop() {
    // Scroll the entire page up to the top for hero section
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function goBack() {
  window.history.back();
}
