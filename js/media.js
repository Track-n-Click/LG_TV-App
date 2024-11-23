import { fetchTVChannels } from "./mediaService.js";

document.addEventListener("DOMContentLoaded", async () => {
  displayPlaceholders("channels-row");

  setTimeout(async () => {
    const tvChannels = await fetchTVChannels();
    replacePlaceholdersWithData("channels-row", tvChannels, "tv");

    initializeMediaNavigation();
  }, 1000);
});

function displayPlaceholders(rowId) {
  const row = document.getElementById(rowId);
  row.innerHTML = "";

  // Get the window's inner width
  const windowWidth = window.innerWidth;

  // Set the dynamic width for the placeholders (window width divided by 6)
  const placeholderWidth = Math.floor(windowWidth / 6);

  // Calculate how many placeholders can fit in the row
  const placeholderCount = Math.floor(windowWidth / placeholderWidth);

  // Create placeholders based on the calculated count
  for (let i = 0; i < placeholderCount; i++) {
    const placeholder = document.createElement("div");
    placeholder.classList.add("placeholder-tile");

    // Set the dynamic width for each placeholder
    placeholder.style.width = `${placeholderWidth - 50}px`;

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
      <div class="title">${item.title || item.name}</div>
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

  const mediaSections = [{ id: "header-placeholder" },{ id: "channels-row" }]; // Define sections (e.g., TV channels)

  // Initialize the first row and item as selected
  if (mediaSections.length > 0) {
    const firstRow = document.getElementById(
      mediaSections[selectedSectionIndex].id
    );
    if (firstRow && firstRow.children.length > 0) {
      firstRow.children[selectedItemIndex].classList.add("selected");
    }
  }

  document.addEventListener("keydown", (e) => {
    if (isModalOpen) {
      return; 
    }
    switch (e.key) {
      case "ArrowUp":
        if (selectedSectionIndex > 0) {
          if(!isModalOpen){
            selectedSectionIndex--;
          }
          // selectedSectionIndex--;
          selectedItemIndex = 0; // Reset to first item when moving to a new section
          updateSelectedSection();
        } else {
          // When reaching the top, scroll up to the relevant section
          scrollPageUp();
        }
        break;
      case "ArrowDown":
        if (selectedSectionIndex < mediaSections.length - 1) {
          if(!isModalOpen){
            selectedSectionIndex++;
          }
          selectedItemIndex = 0; // Reset to first item when moving to a new section
          updateSelectedSection();
        } else {
          // Scroll down if trying to move beyond the last section
          scrollPageDown();
        }
        break;
      case "ArrowLeft":
        navigateGrid(-1);
        break;
      case "ArrowRight":
        navigateGrid(1);
        break;
      case "Enter":
        handleEnter();
        break;
      case "Escape":
        if(mediaSections[selectedSectionIndex].id !== "header-placeholder" || !isModalOpen){
          goBack();
        }
        break;
        break;
    }
  });

  function handleEnter(){
    if(mediaSections[selectedSectionIndex].id==="header-placeholder" || isModalOpen){
      if (document.getElementById("profile-button").classList.contains("selected")) {
        openLoginModal();
      } else if (document.getElementById("settings-button").classList.contains("selected")) {
        redirect("settings.html");
      }
    }
    else{
      playSelectedVideo();
    }
  }

  function updateSelectedSection() {
    deselectProfileButton();
    deselectSettingsButton();
    if(mediaSections[selectedSectionIndex].id==="header-placeholder" && !isModalOpen){
      console.warn("test");
      const prevSection = document.querySelector(".video-tile.selected");
      if (prevSection) prevSection.classList.remove("selected");
      selectSettingsButton();
      scrollToTile(document.getElementById(mediaSections[selectedSectionIndex].id));
    }
    else{
      // Clear the selected class from the current section and item
      const prevSection = document.querySelector(".video-tile.selected");
      if (prevSection) prevSection.classList.remove("selected");

      // Select the new section and first item
      const currentRow = document.getElementById(
        mediaSections[selectedSectionIndex].id
      );
      const currentTiles = currentRow.querySelectorAll(".video-tile");

      if (currentTiles.length > 0) {
        currentTiles[selectedItemIndex].classList.add("selected");
        scrollToTile(currentTiles[selectedItemIndex]);
      }
    }
  }

  function navigateGrid(step) {
    if(mediaSections[selectedSectionIndex].id === "header-placeholder" && !isModalOpen){
      handleSettingsProfileNavigation(step===1 ? "ArrowRight" : "ArrowLeft");
    }
    else{
      const currentRow = document.getElementById(
        mediaSections[selectedSectionIndex].id
      );
      const currentTiles = currentRow.querySelectorAll(".video-tile");
  
      if (currentTiles.length > 0) {
        currentTiles[selectedItemIndex].classList.remove("selected");
        selectedItemIndex =
          (selectedItemIndex + step + currentTiles.length) % currentTiles.length;
        currentTiles[selectedItemIndex].classList.add("selected");
  
        scrollToTile(currentTiles[selectedItemIndex]);
      }
    }
  }

  function scrollToTile(tile) {
    tile.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }

  function scrollPageUp() {
    // Scroll the entire page up when at the top section
    window.scrollBy({
      top: -window.innerHeight,
      behavior: "smooth",
    });
  }

  function scrollPageDown() {
    // Scroll the entire page down when at the last section
    window.scrollBy({
      top: window.innerHeight,
      behavior: "smooth",
    });
  }

  function playSelectedVideo() {
    const selectedTile = document.querySelector(".video-tile.selected");
    if (!selectedTile) return;

    const videoUrl = selectedTile.getAttribute("data-url");
    const title = selectedTile.getAttribute("data-title");
    const vastTagUrl = "https://ayotising.com/fc.php?script=rmVideo&zoneid=59&format=vast3";
    console.log("VAST Tag URL:", vastTagUrl);

    const queryString = `title=${encodeURIComponent(
      title
    )}&src=${encodeURIComponent(
      videoUrl
    )}&vast-tag=${encodeURIComponent(vastTagUrl)}`;

    const encodedQueryString = btoa(queryString);
    window.location.href = `player.html?data=${encodedQueryString}`;
  }
}

function goBack() {
  window.history.back();
}
