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
        <div class="overlay"></div>
        <img class="imgCarousal" src="${details.bannerImage}" alt="${
    details.title
  }"/>
        <div class="slider-info">
          
          <h1 class="slider-title">${details.title}</h1>
          <p class="category">${details?.category}</p>
          <p class="duration">Duration :
            ${
              details?.duration
                ? formatDuration(details?.duration)
                : "Duration not available"
            }
        </p>
          <p class="slider-description" >${(details.description.length > 350
            ? details.description.substring(0, 350) + "..."
            : details.description
          )
            .replace(/&amp;/g, "&")
            .replace(/&rsquo;/g, "’")
            .replace(/&ldquo;/g, '"')
            .replace(/&rdquo;/g, '"')
            .replace(/&nbsp;/g, "")
            .replace(/\n/g, "<br/>")}</p>

          <div class="countdown-timer">
          <div class="days">00</div>
          <div class="hours">00</div>
          <div class="minutes">00</div>
          <div class="seconds">00</div>
        </div>
          <button class="slider-button" id="slider-button" data-url="${
            details.stream_url
          }" data-type="${type}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <h3>Watch Now</h3>
          </button>
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

  // Initialize the countdown timer for this specific slide
  const countdownElements = slideItem.querySelector(".countdown-timer");
  initializeCountdownTimer(
    details.end_date_time,
    countdownElements,
    details.streaming_status,
    sliderButton
  );
}

function formatDuration(duration) {
  // Extract the number of minutes from the string
  const minutes = parseInt(duration.replace("m", "").trim());

  // Calculate hours and remaining minutes
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  // Return the formatted string
  return `${hours}h ${remainingMinutes}min`;
}

function initializeCountdownTimer(
  endDateTime,
  countdownElements,
  streaming_status,
  sliderButton
) {
  // Get the end date-time from the event details
  const endDate = new Date(endDateTime);

  // Function to update the countdown timer
  function updateCountdownTimer() {
    const currentDate = new Date();
    const remainingTime = endDate - currentDate;

    if ((remainingTime <= 0) & (streaming_status == "ended")) {
      // Event has ended, stop the countdown
      clearInterval(countdownInterval);
      sliderButton.style.display = "none";
      countdownElements.innerHTML =
        "<div class='expired'><h3>Event Ended</h3> <p class='expired-text'>The live streaming for this event has concluded. Stay tuned for future events and updates. If you missed the live broadcast, check back later for on-demand content.</p></div>";
      return;
    }

    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    countdownElements.querySelector(".days").textContent = days
      .toString()
      .padStart(2, "0");
    countdownElements.querySelector(".hours").textContent = hours
      .toString()
      .padStart(2, "0");
    countdownElements.querySelector(".minutes").textContent = minutes
      .toString()
      .padStart(2, "0");
    countdownElements.querySelector(".seconds").textContent = seconds
      .toString()
      .padStart(2, "0");
  }

  // Start the countdown timer and update every second
  const countdownInterval = setInterval(updateCountdownTimer, 1000);
  updateCountdownTimer(); // Initialize immediately without waiting 1s
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
