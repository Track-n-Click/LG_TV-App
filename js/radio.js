import {
  fetchRandomStations,
  fetchMostTunedStations,
} from "./radioService.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Display placeholders and then fetch and display latest songs
  displayPlaceholders("latest-radio-channels-row");
  displayPlaceholders("radio-you-might-like-row");

  setTimeout(async () => {
    const mostTunedStations = await fetchMostTunedStations();
    replacePlaceholdersWithData("latest-radio-channels-row", mostTunedStations);

    const randomStations = await fetchRandomStations();
    replacePlaceholdersWithData("radio-you-might-like-row", randomStations);
  }, 1000);

  // Display placeholders and then fetch and display most played songs
  // displayPlaceholders("most-played-songs-row");
  // const mostPlayedSongs = await fetchMostPlayedSongs();
  // replacePlaceholdersWithData("most-played-songs-row", mostPlayedSongs);

  // const sliders = await fetchMostPlayedSongs();
  // createSliders(sliders);

  // console.log(sliders);

  // initializeSwiperHero();

  // Initialize navigation
  initializeMusicNavigation();
});

// function initializeSwiperHero() {
//   var swiper = new Swiper(".swiper-container-hero", {
//     effect: "coverflow",
//     grabCursor: false,
//     centeredSlides: true,
//     slidesPerView: 3,
//     coverflowEffect: {
//       rotate: 10,
//       // stretch: 5,
//       depth: 110,
//       // modifier: 1,
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
//         ? slide.description.slice(0, 300) + "..."
//         : slide.description;

//     slideItem.innerHTML = `

//         <div class="slider-info">
//         <img class="imgCarousal" src="${slide.artwork_url}" alt="${slide.title}"/>
//         <h1 class="slider-title">${slide.title}</h1>
//         <p class="slider-description">${truncatedDescription}</p>
//         <button class="slider-button"><i class="fas fa-play"></i></button></div>
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

function replacePlaceholdersWithData(rowId, radioStations) {
  const row = document.getElementById(rowId);
  row.innerHTML = "";

  if (Array.isArray(radioStations)) {
    radioStations.forEach((item, index) => {
      const tile = document.createElement("div");
      tile.setAttribute("type", "radio");
      tile.setAttribute("radio-id", item.id);
      tile.classList.add("music-tile");
      tile.setAttribute("data-index", index);
      tile.setAttribute("data-title", item.title);
      tile.setAttribute("data-url", item.stream_url || item.url);
      tile.setAttribute("data-artist", "test");
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
    console.error("Expected an array but received:", radioStations);
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
      id: "latest-radio-channels-row",
      leftArrow: "left-arrow-movies",
      rightArrow: "right-arrow-movies",
    },
    {
      id: "radio-you-might-like-row",
      leftArrow: "left-arrow-tv",
      rightArrow: "right-arrow-tv",
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
    const albumId = selectedTile.getAttribute("id");
    const songId = selectedTile.getAttribute("song-id");

    if (type === "music") {
      window.location.href = `musicPlayer.html?id=${encodeURIComponent(
        songId
      )}`;
    } else {
      window.location.href = `musicPlayerForAlbum.html?id=${encodeURIComponent(
        albumId
      )}`;
    }
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
