import { fetchMovies, fetchTVSeries } from "./mediaService.js";

document.addEventListener("DOMContentLoaded", () => {
  displayPlaceholders("movie-row");
  displayPlaceholders("tv-row");

  setTimeout(async () => {
    try {
      const movies = await fetchMovies();
      replacePlaceholdersWithData("movie-row", movies, "movies");

      const tvSeries = await fetchTVSeries();
      replacePlaceholdersWithData("tv-row", tvSeries, "series");

      // console.log("Tv", tvSeries);

      initializeMediaNavigation();
    } catch (error) {
      console.error("Failed to load media data:", error);
    }
  }, 1000);
});

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
    tile.setAttribute("data-id", item.id);
    tile.setAttribute("data-thumbnail", item.thumbnail);
    tile.setAttribute("data-description", item.description);
    tile.setAttribute("data-poster", item.poster || item.thumbnail);
    tile.innerHTML = `
      <div class="overlay">
        <svg class="play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" >
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>
      <img src="${item.thumbnail}" alt="${item.title}">
      <div class="title">${
        (item.title || item.name).length > 25
          ? (item.title || item.name).substring(0, 25) + "..."
          : item.title || item.name
      }</div>
    `;
    tile.addEventListener("click", () => {
      playSelectedVideo();
    });
    row.appendChild(tile);
  });
}

function initializeMediaNavigation() {
  let selectedSectionIndex = 1;
  let selectedItemIndex = 0;
  const mediaSections = [
    {
      id: "swiper-wrapper",
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

  // Automatically select the first tile in the first section (e.g., "movie-row")
  if (mediaSections.length > 0) {
    const firstRow = document.getElementById(
      mediaSections[selectedSectionIndex].id
    );

    if (firstRow) {
      const firstTile = firstRow.querySelector(".video-tile");

      if (firstTile) {
        firstTile.classList.add("selected");
        updateHeroSection(firstTile); // Update hero section with the first tile's data
      }
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

    if (mediaSections[selectedSectionIndex].id === "swiper-wrapper") {
      scrollToTop(); // Scroll to the top for the hero section
    } else {
      const newTiles = newRow.querySelectorAll(".video-tile");
      if (newTiles.length > 0) {
        newTiles[selectedItemIndex].classList.add("selected");
        updateHeroSection(newTiles[selectedItemIndex]);
        // scrollToSection(newRow);
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
      updateHeroSection(currentTiles[selectedItemIndex]);
      scrollToTile(currentRow, currentTiles[selectedItemIndex]);
      updateArrowVisibility(currentRow, currentTiles);
    }
  }

  function updateHeroSection(selectedTile) {
    const sliderList = document.querySelector(".swiper-wrapper");

    // Clear existing slides in the swiper wrapper
    sliderList.innerHTML = "";

    // Create a new slide
    const slideItem = document.createElement("div");
    slideItem.className = "swiper-slide";

    slideItem.innerHTML = `
      <div class="overlay"></div>
      <div class="overlay"></div>
      <img 
        class="imgCarousal" 
        src="${selectedTile.getAttribute("data-poster")}" 
        alt="${selectedTile.getAttribute("data-title") || "Video Thumbnail"}"
      />
      <div class="slider-info">
        <h1 class="slider-title">${
          selectedTile.getAttribute("data-title") || "Videos"
        }</h1>
        <p class="slider-description">${
          selectedTile.getAttribute("data-description")?.length > 400
            ? selectedTile.getAttribute("data-description").substring(0, 400) +
              "..."
            : selectedTile.getAttribute("data-description") ||
              "Discover and watch videos from around the world."
        }</p>
        <button 
          class="slider-button" 
          id="slider-button" 
          data-url="${selectedTile.getAttribute("data-url")}" 
          data-type="${selectedTile.getAttribute("data-type")}" 
          data-title="${selectedTile.getAttribute("data-title")}" 
          data-description="${selectedTile.getAttribute("data-description")}" 
          data-thumbnail="${selectedTile.getAttribute("data-thumbnail")}">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            width="22" 
            height="22" 
            fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <h3>Watch Now</h3>
        </button>
      </div>
    `;

    // Append the updated slide
    sliderList.appendChild(slideItem);

    // Add event listener to the new button (optional based on your needs)
    const sliderButton = slideItem.querySelector(".slider-button");
    sliderButton.addEventListener("click", () => {
      document.querySelectorAll(".slider-button.selected").forEach((button) => {
        button.classList.remove("selected");
      });
      sliderButton.classList.add("selected");
    });
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
    // Scroll the entire page up to the top for hero section
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function goBack() {
  window.history.back();
}
