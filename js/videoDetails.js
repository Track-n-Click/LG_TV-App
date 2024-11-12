import {
  fetchVideoDetailsBySlug,
  fetchSeriesDetailsBySlug,
} from "./mediaService.js";

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);

  const movieSlug = urlParams.get("movie-slug");
  const seriesSlug = urlParams.get("series-slug");

  let details;

  try {
    if (movieSlug) {
      const videoGridContainer = document.getElementById(
        "video-grid-container"
      );
      if (videoGridContainer) {
        videoGridContainer.style.display = "none";
      }
      details = await fetchVideoDetailsBySlug(movieSlug);
      console.log("movie", details);
      setupDetailsSection(details);
      initializeMediaNavigation();
    } else if (seriesSlug) {
      details = await fetchSeriesDetailsBySlug(seriesSlug);
      console.log("series", details);
      const seasons = details.seasons;
      createSeasonsAndEpisodes(seasons);
      setupDetailsSection(details);
      initializeMediaNavigation(details.seasons);
    } else {
      console.log("No valid slug found in the URL.");
      return;
    }

    createSliders(details);
  } catch (error) {
    console.error("Error fetching video or series details:", error);
    // Optionally handle UI updates for error state
  }
});

/**
 * Function to set up the details section with actors, directors, producers, and genres.
 * If any detail is missing, it will hide the relevant section.
 * @param {Object} details
 */
function setupDetailsSection(details) {
  const { actors = [], directors = [], producers = [] } = details;

  // Reference the details section elements
  const detailsSection = document.getElementById("details-section");
  const starsElement = document.querySelector("#details-section .stars-list");
  const directorsElement = document.querySelector(
    "#details-section .directors-list"
  );
  const producersElement = document.querySelector(
    "#details-section .producers-list"
  );

  // Setup actors (stars)
  if (actors.length > 0) {
    starsElement.innerHTML = actors
      .map((actor) => {
        return `
          <li class="item">
            <img src="${actor.artwork_url}" alt="${actor.name}" class="avatar"/>
            <p href="${actor.permalink_url}" target="_blank" class="name">${actor.name}</p>
          </li>`;
      })
      .join(""); // Join all the HTML strings into one
  } else {
    starsElement.parentElement.style.display = "none"; // Hide stars section if no data
  }

  // Setup directors
  if (directors.length > 0) {
    directorsElement.innerHTML = directors
      .map((director) => {
        return `
          <li class="item">
            <img src="${director.artwork_url}" alt="${director.name}" class="avatar"/>
            <p href="${director.permalink_url}" target="_blank" class="name">${director.name}</p>
          </li>`;
      })
      .join("");
  } else {
    directorsElement.parentElement.style.display = "none"; // Hide directors section if no data
  }

  // Setup producers
  if (producers.length > 0) {
    producersElement.innerHTML = producers
      .map((producer) => {
        return `
          <li class="item">
            <img src="${producer.artwork_url}" alt="${producer.name}" class="avatar"/>
            <p href="${producer.permalink_url}" target="_blank" class="name">${producer.name}</p>
          </li>`;
      })
      .join("");
  } else {
    producersElement.parentElement.style.display = "none";
  }
  if (!actors.length && !directors.length && !producers.length) {
    detailsSection.style.display = "none";
  }
}

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
      <p class="slider-description">${
        details.description.length > 400
          ? details.description.substring(0, 400) + "..."
          : details.description
      }</p>
      <button class="slider-button" id="slider-button" data-url="${
        details.url || details?.seasons[0]?.episodes[0].stream_key
      }" data-type="${type}">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M8 5v14l11-7z"/>
      </svg>
      <h3>Watch Now</h3></button>
      </div>
      
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
    // { id: "navbar-container", leftArrow: "", rightArrow: "" },

    { id: "details-section", leftArrow: "", rightArrow: "" },
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
      ".slider-button, .video-tile, .details-container"
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
      ".slider-button, .video-tile, .details-container"
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
      ".video-tile, .slider-button"
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
