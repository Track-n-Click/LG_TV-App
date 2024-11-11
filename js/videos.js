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

      initializeMediaNavigation();
    } catch (error) {
      console.error("Failed to load media data:", error);
    }
  }, 1000);
});

// function initializeSwiperHero() {
//   var swiper = new Swiper(".swiper-container-hero", {
//     effect: "coverflow",
//     grabCursor: false,
//     centeredSlides: true,
//     slidesPerView: 2,
//     coverflowEffect: {
//       rotate: 10,
//       stretch: 10,
//       depth: 110,
//       modifier: 5,
//       slideShadows: true,
//     },
//     loop: true,
//     pagination: {
//       el: ".swiper-pagination",
//     },
//     autoplay: {
//       delay: 2000,
//       disableOnInteraction: true,
//     },
//   });
// }

// function createSliders(sliders) {
//   const sliderList = document.querySelector(".swiper-wrapper");

//   sliders.forEach((slide) => {
//     const slideItem = document.createElement("div");
//     slideItem.className = "swiper-slide";

//     // Slice the description to a desired length (e.g., 100 characters)
//     const truncatedDescription =
//       slide?.description?.length > 300
//         ? slide?.description.slice(0, 300) + "..."
//         : slide?.description;

//     slideItem.innerHTML = `
//         <img class="imgCarousal" src="${slide.poster_image}" alt="${slide.title}"/>
//         <div class="slider-info">
//         <h1 class="slider-title">${slide.title}</h1>
//         <p class="slider-description">${truncatedDescription}</p>
//         <button class="slider-button">Watch Now</button></div>
//       `;

//     sliderList.appendChild(slideItem);
//   });
// }

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
  let selectedSectionIndex = 0;
  let selectedItemIndex = 0;
  const mediaSections = [
    {
      id: "hero-container",
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

    if (mediaSections[selectedSectionIndex].id === "hero-container") {
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
    // Scroll the entire page up to the top for hero section
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function goBack() {
  window.history.back();
}
