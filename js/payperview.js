import { fetchAllPayperview } from "./payperviewService.js";

document.addEventListener("DOMContentLoaded", () => {
  displayPlaceholders("upcoming-payperview-row");
  displayPlaceholders("past-payperview-row");

  setTimeout(async () => {
    try {
      // Fetch the data once
      const allPayperview = await fetchAllPayperview();

      // Get the current date and time
      // const now = new Date();

      // Separate upcoming and past events based on end date

      // const upcomingEvents = allPayperview.filter(
      //   (event) => new Date(event.end_date_time) > now
      // );
      const upcomingEvents = allPayperview.filter(
        (event) => event.event_status === "streaming"
      );
      const pastEvents = allPayperview.filter(
        (event) => event.event_status === "ended"
      );

      // Check if there are any upcoming events
      const payperviewSection = document.getElementById("payperview-upcoming");
      if (upcomingEvents === undefined || upcomingEvents.length === 0) {
        // Hide the payperview section if there are no upcoming events
        payperviewSection.style.display = "none !important";
      } else {
        // Show the section and populate with upcoming events if any
        payperviewSection.style.display = "flex";
        replacePlaceholdersWithData(
          "upcoming-payperview-row",
          upcomingEvents,
          "ppv"
        );
      }

      // Populate past events
      replacePlaceholdersWithData("past-payperview-row", pastEvents, "ppv");

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

  mediaItems?.forEach((item, index) => {
    const tile = document.createElement("div");
    tile.classList.add("ppv-tile");
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
      id: "upcoming-payperview-row",
      leftArrow: "left-arrow-payperview",
      rightArrow: "right-arrow-payperview",
    },
    {
      id: "past-payperview-row",
      leftArrow: "left-arrow-payperview",
      rightArrow: "right-arrow-payperview",
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
    const currentTiles = currentRow.querySelectorAll(".ppv-tile");

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
      const newTiles = newRow.querySelectorAll(".ppv-tile");
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
    const currentTiles = currentRow.querySelectorAll(".ppv-tile");

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
    const selectedTile = document.querySelector(".ppv-tile.selected");
    if (!selectedTile) return;

    const videoUrl = selectedTile.getAttribute("data-url");
    const slug = selectedTile.getAttribute("data-slug");
    const mediaType = selectedTile.getAttribute("data-type");
    const title = selectedTile.getAttribute("data-title");

    console.log("Selected video type:", mediaType);

    if (mediaType === "ppv") {
      console.log("Redirecting to ppv details page...");
      window.location.href = `payperview/ppvDetailsPage.html?ppv-slug=${encodeURIComponent(
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
