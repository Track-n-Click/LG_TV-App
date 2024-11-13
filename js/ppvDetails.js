import { fetchPPVDetailsBySlug } from "./payperviewService.js";

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);

  const ppvSlug = urlParams.get("ppv-slug");

  let details;

  try {
    if (ppvSlug) {
      const videoGridContainer = document.getElementById(
        "video-grid-container"
      );
      if (videoGridContainer) {
        videoGridContainer.style.display = "none";
      }
      details = await fetchPPVDetailsBySlug(ppvSlug);
      console.log("ppv", details);
      //   setupDetailsSection(details);

      createSliders(details);
      initializeMediaNavigation();
    } else {
      console.log("No valid slug found in the URL.");
      return;
    }
  } catch (error) {
    console.error("Error fetching video or series details:", error);
    // Optionally handle UI updates for error state
  }
});

function createSliders(details) {
  const sliderList = document.querySelector(".swiper-wrapper");

  const slideItem = document.createElement("div");
  slideItem.className = "swiper-slide";

  const type = "ppv";

  slideItem.innerHTML = `
        <div class="overlay"></div>
        <img class="imgCarousal" src="${details.bannerImage}" alt="${
    details.title
  }"/>
        <div class="slider-info">
        <h1 class="slider-title">${details.title}</h1>
        <p class="slider-description">${
          details.description.length > 400
            ? details.description.substring(0, 400) + "..."
            : details.description
        }</p>
        <button class="slider-button" id="slider-button" data-url="${
          details.stream_url
        }" data-type="${type}">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
        <h3>Watch Now</h3></button>
        </div>
        
      `;

  sliderList.appendChild(slideItem);
  // Add event listener to the new button
  const sliderButton = slideItem.querySelector(".slider-button");
  sliderButton.addEventListener("click", (event) => {
    document.querySelectorAll(".slider-button.selected").forEach((button) => {
      button.classList.remove("selected");
    });
    sliderButton.classList.add("selected");
  });
}

function initializeMediaNavigation(seasons) {
  let selectedSectionIndex = 0;
  let selectedItemIndex = 0;
  const mediaSections = [
    // { id: "navbar-container", leftArrow: "", rightArrow: "" },

    // { id: "details-section", leftArrow: "", rightArrow: "" },
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
    const currentTiles = currentRow.querySelectorAll(".slider-button ");

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
    const newTiles = newRow.querySelectorAll(".slider-button ");

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
    const currentTiles = currentRow.querySelectorAll(" .slider-button");

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

    if (!selectedButton && !selectedTile) {
      console.error("No video button or tile is selected.");
      return;
    }

    console.log("Slected", selectedButton);

    // Safely get the type from either selectedButton or selectedTile
    const type = selectedButton
      ? selectedButton.getAttribute("data-type")
      : selectedTile?.getAttribute("data-type");

    console.log("type", type);

    if (type === "ppv" && selectedButton) {
      // Get the encoded URL
      const encodedPpvUrl = selectedButton.getAttribute("data-url");

      // Decode the URL using the function
      const decodedPpvUrl = decodePpvUrl(encodedPpvUrl);

      if (decodedPpvUrl) {
        // Redirect to the player page with the decoded URL as a query parameter
        window.location.href = `../player.html?ppv-src=${encodeURIComponent(
          decodedPpvUrl
        )}`;
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

// Function to decode a Base64 encoded PPV URL
function decodePpvUrl(encodedUrl) {
  try {
    const decodedUrl = atob(encodedUrl);
    console.log("Decoded PPV URL:", decodedUrl);
    return decodedUrl;
  } catch (error) {
    console.error("Decoding failed:", error);
    return null; // Return null if decoding fails
  }
}

function goBack() {
  window.history.back();
}
