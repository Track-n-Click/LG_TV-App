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
    //remove the episode list
    const videoGridContainer = document.getElementById("video-grid-container");
    if (videoGridContainer) {
      videoGridContainer.style.display = "none";
    }
    details = await fetchVideoDetailsBySlug(movieSlug);
    console.log("movie", details);
    initializeMediaNavigation();
  } else if (seriesSlug) {
    details = await fetchSeriesDetailsBySlug(seriesSlug);
    console.log("series", details);
    const seasons = details.seasons;
    createSeasonsAndEpisodes(seasons);
    initializeMediaNavigation(details.seasons);
  } else {
    console.log("No valid slug found in the URL.");
    return;
  }

  createSliders(details);

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

  const type = details.tv_show_type === "tv_show" ? "series" : "movie";

  slideItem.innerHTML = `
      <div class="overlay"></div>
      <img class="imgCarousal" src="${
        details.poster_image || details.poster
      }" alt="${details.title}"/>
      <div class="slider-info">
      <h1 class="slider-title">${details.title}</h1>
      <p class="slider-description">${details.description}</p>
      <button class="slider-button" id="slider-button" data-url="${
        details.url || details?.seasons[0]?.episodes[0].stream_key
      }" data-type="${type}">Watch Now</button></div>
    `;

  sliderList.appendChild(slideItem);

  // console.log("key", details?.seasons[0]?.episodes[0].stream_key);

  // Add event listener to the new button
  const sliderButton = slideItem.querySelector(".slider-button");
  sliderButton.addEventListener("click", (event) => {
    document.querySelectorAll(".slider-button.selected").forEach((button) => {
      button.classList.remove("selected");
    });
    sliderButton.classList.add("selected");
  });
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
    tile.setAttribute("data-url", item.stream_key);
    tile.setAttribute("data-type", "series");
    tile.innerHTML = `
      <img src="${item.thumbnail}" alt="${item.title}">
      <div class="title">${item.title || item.name}</div>
    `;
    tile.addEventListener("click", () => {
      window.location.href = `player.html?title=${encodeURIComponent(
        item.title || item.name
      )}&src=${encodeURIComponent(item.stream_key)}`;
    });
    row.appendChild(tile);
  });
}

function createSeasonsAndEpisodes(seasons) {
  const seasonsContainer = document.getElementById("seasons-container");

  if (!seasonsContainer) {
    console.error(`No element found with ID: ${containerId}`);
    return;
  }

  if (seasons && seasons.length > 0) {
    seasons.forEach((season, index) => {
      // Create a new season header element
      const seasonNumber = document.createElement("h2");
      seasonNumber.innerHTML = `Season ${index + 1}`;

      // Create a new movie-row container for each season
      const movieRowContainer = document.createElement("div");
      movieRowContainer.className = "video-row";
      movieRowContainer.id = `movie-row-${index}`;

      // Append the season header and the movie row to the container
      seasonsContainer.appendChild(seasonNumber);
      seasonsContainer.appendChild(movieRowContainer);

      // Display placeholders in the new movie row
      displayPlaceholders(`movie-row-${index}`);

      // Replace placeholders with season episodes
      replacePlaceholdersWithData(`movie-row-${index}`, season.episodes);
    });
  } else {
    console.log("No seasons found.");
  }
}

function initializeMediaNavigation(seasons) {
  let selectedSectionIndex = 0;
  let selectedItemIndex = 0;
  const mediaSections = [
    { id: "navbar-container", leftArrow: "", rightArrow: "" },
    { id: "swiper-wrapper", leftArrow: "", rightArrow: "" },
  ];

  function updateMediaSections(mediaSections, seasons) {
    seasons.forEach((season, index) => {
      mediaSections.push({
        id: `movie-row-${index}`,
        leftArrow: "left-arrow-movies",
        rightArrow: "right-arrow-movies",
      });
    });
  }

  if (seasons && seasons.length > 0) {
    updateMediaSections(mediaSections, seasons);
  }

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
      ".video-tile, .menu-list-item, .slider-button "
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
      ".video-tile, .menu-list-item, .slider-button"
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
      ".video-tile, .menu-list-item, .slider-button"
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
    const selectedButton = document.querySelector(".slider-button.selected");
    const selectedTile = document.querySelector(".video-tile.selected");

    if (!selectedButton && !selectedTile) {
      console.error("No video button or tile is selected.");
      return;
    }

    // Safely get the type from either selectedButton or selectedTile
    const type = selectedButton
      ? selectedButton.getAttribute("data-type")
      : selectedTile?.getAttribute("data-type");

    if (type === "movie" && selectedButton) {
      const videoUrl = selectedButton.getAttribute("data-url");
      console.log("Movie URL:", videoUrl);
      window.location.href = `../player.html?movie-src=${encodeURIComponent(
        videoUrl
      )}`;
    } else if (type === "series") {
      const videoUrl =
        selectedButton?.getAttribute("data-url") ||
        selectedTile?.getAttribute("data-url");

      if (videoUrl) {
        console.log("Series URL:", videoUrl);
        window.location.href = `../player.html?series-src=${encodeURIComponent(
          videoUrl
        )}`;
      } else {
        console.error("No URL found for the series.");
      }
    } else {
      console.error(
        "Invalid type or no selected button/tile for the video type."
      );
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
}

function goBack() {
  window.history.back();
}
