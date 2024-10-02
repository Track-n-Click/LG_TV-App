import { fetchTVChannels } from "./mediaService.js";

document.addEventListener("DOMContentLoaded", async () => {
  setTimeout(async () => {
    displayPlaceholders("channels-row");
    const tvChannels = await fetchTVChannels();
    replacePlaceholdersWithData("channels-row", tvChannels, "tv");

    initializeMediaNavigation();
  }, 1000);
});

function displayPlaceholders(rowId) {
  const row = document.getElementById(rowId);
  for (let i = 0; i < 7; i++) {
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
      <img src="${item.thumbnail}" alt="${item.title}">
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

  const mediaSections = [{ id: "channels-row" }];

  if (mediaSections.length > 0) {
    const firstRow = document.getElementById(
      mediaSections[selectedSectionIndex].id
    );
    if (firstRow && firstRow.children.length > 0) {
      firstRow.children[selectedItemIndex].classList.add("selected");
    }
  }

  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowUp":
        navigateGrid(-5);
        break;
      case "ArrowDown":
        navigateGrid(5);
        break;
      case "ArrowLeft":
        navigateGrid(-1);
        break;
      case "ArrowRight":
        navigateGrid(1);
        break;
      case "Enter":
        playSelectedVideo();
        break;
      case "Escape":
        goBack();
        break;
    }
  });

  function navigateGrid(step) {
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
    }
  }

  function scrollToTile(row, tile) {
    tile.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }

  function playSelectedVideo() {
    const selectedTile = document.querySelector(".video-tile.selected");
    if (!selectedTile) return;

    const videoUrl = selectedTile.getAttribute("data-url");
    const title = selectedTile.getAttribute("data-title");

    window.location.href = `player.html?title=${encodeURIComponent(
      title
    )}&src=${encodeURIComponent(videoUrl)}`;
  }
}

function goBack() {
  window.history.back();
}
