import {
  fetchAlbums,
  fetchLatestSongs,
  fetchMostPlayedSongs,
} from "./musicService.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Display placeholders and then fetch and display latest songs
  displayPlaceholders("latest-songs-row");
  const latestSongs = await fetchLatestSongs();
  replacePlaceholdersWithData("latest-songs-row", latestSongs);

  // Display placeholders and then fetch and display albums
  displayPlaceholders("album-row");
  const albums = await fetchAlbums();
  replacePlaceholdersWithData("album-row", albums);

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
  for (let i = 0; i < 6; i++) {
    // Display 6 placeholders per row
    const placeholder = document.createElement("div");
    placeholder.classList.add("placeholder-tile");
    placeholder.innerHTML = `
            <div class="placeholder-img"></div>
            <div class="placeholder-title"></div>
        `;
    row.appendChild(placeholder);
  }
}

function replacePlaceholdersWithData(rowId, musicItems) {
  const row = document.getElementById(rowId);
  row.innerHTML = "";

  if (Array.isArray(musicItems)) {
    musicItems.forEach((item, index) => {
      const tile = document.createElement("div");
      if (rowId === "album-row") {
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
                <img src="${item.artwork_url}" alt="${item.title}">
                <div class="title">${item.title}</div>
            `;
      row.appendChild(tile);
    });
  } else {
    console.error("Expected an array but received:", musicItems);
  }
}

function initializeMusicNavigation() {
  let selectedSectionIndex = 0;
  let selectedItemIndex = 0;
  const musicSections = [
    // "hero-container",
    // "latest-songs-row",
    // "album-row",
    // "most-played-songs-row",
    {
      id: "hero-container",
      leftArrow: null,
      rightArrow: null,
    },
    {
      id: "latest-songs-row",
      leftArrow: "left-arrow-movies",
      rightArrow: "right-arrow-movies",
    },
    {
      id: "album-row",
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
