import {
  fetchVideoDetailsBySlug,
  fetchSeriesDetailsBySlug,
} from "./mediaService.js";

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);

  const movieSlug = urlParams.get("movie-slug");
  const seriesSlug = urlParams.get("series-slug");

  let details;

  if (movieSlug) {
    details = await fetchVideoDetailsBySlug(movieSlug);
    console.log("movie", details);
  } else if (seriesSlug) {
    details = await fetchSeriesDetailsBySlug(seriesSlug);
    console.log("series", details);
  } else {
    console.log("No valid slug found in the URL.");
    return;
  }

  // Proceed to create sliders or handle other DOM manipulations
  createSliders(details);

  // Uncomment and customize these functions as needed
  // displayPlaceholders("movie-row");
  // const movies = await fetchMovies();
  // replacePlaceholdersWithData("movie-row", movies);
  // initializeMediaNavigation();
  // initializeSwiperHero();
});

function initializeSwiperHero() {
  var swiper = new Swiper(".swiper-container-hero", {
    effect: "coverflow",
    grabCursor: false,
    centeredSlides: true,
    slidesPerView: 1,
    loop: true,
    pagination: {
      el: ".swiper-pagination",
    },
  });
}

function createSliders(details) {
  const sliderList = document.querySelector(".swiper-wrapper");

  const slideItem = document.createElement("div");
  slideItem.className = "swiper-slide";

  slideItem.innerHTML = `
      <div class="overlay"></div>
      <img class="imgCarousal" src="${
        details.poster_image || details.poster
      }" alt="${details.title}"/>
      <div class="slider-info">
      <h1 class="slider-title">${details.title}</h1>
      <p class="slider-description">${details.description}</p>
      <button class="slider-button">Watch Now</button></div>
    `;

  sliderList.appendChild(slideItem);
}

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

function replacePlaceholdersWithData(rowId, mediaItems) {
  const row = document.getElementById(rowId);
  row.innerHTML = ""; // Clear placeholders

  mediaItems.forEach((item, index) => {
    const tile = document.createElement("div");
    tile.classList.add("video-tile");
    tile.setAttribute("data-index", index);
    tile.setAttribute("data-url", item.stream_url);
    tile.innerHTML = `
      <img src="${item.thumbnail}" alt="${item.title}">
      <div class="title">${item.title || item.name}</div>
    `;
    tile.addEventListener("click", () => {
      window.location.href = `player.html?title=${encodeURIComponent(
        item.title || item.name
      )}&src=${encodeURIComponent(item.stream_url)}`;
    });
    row.appendChild(tile);
  });
}

function initializeMediaNavigation() {
  let selectedSectionIndex = 0;
  let selectedItemIndex = 0;
  const mediaSections = [
    { id: "navbar-container", leftArrow: "", rightArrow: "" },
    { id: "swiper-wrapper", leftArrow: "", rightArrow: "" },
    {
      id: "movie-row",
      leftArrow: "left-arrow-movies",
      rightArrow: "right-arrow-movies",
    },
  ];

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
    const currentTiles = currentRow.querySelectorAll(
      ".video-tile, .menu-list-item, .swiper-slide"
    );

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
    const newTiles = newRow.querySelectorAll(
      ".video-tile, .menu-list-item, .swiper-slide"
    );

    if (newTiles.length > 0) {
      newTiles[selectedItemIndex].classList.add("selected");
      scrollToSection(newRow);
      updateArrowVisibility(newRow, newTiles);
    }
  }

  function navigateItems(step) {
    const currentRow = document.getElementById(
      mediaSections[selectedSectionIndex].id
    );
    const currentTiles = currentRow.querySelectorAll(
      ".video-tile, .menu-list-item"
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

  function playSelectedVideo() {
    const selectedTile = document.querySelector(".video-tile.selected");
    const videoUrl = selectedTile.getAttribute("data-url");
    window.location.href = `player.html?src=${encodeURIComponent(videoUrl)}`;
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
}

function goBack() {
  window.history.back();
}