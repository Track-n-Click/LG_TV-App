import { fetchSliders } from "./mediaService.js";

let selectedIndex = 0;
let currentSection = "grid"; // Possible values: 'settings_profile', 'slider', 'grid'
let swiper;
let currentSliderIndex = 0;

document.addEventListener("DOMContentLoaded", initializeContent);
window.addEventListener("load", initializeSenza);

function initializeContent() {
  setTimeout(async () => {
    const sliders = await fetchSliders();
    createSliders(sliders);
    initializeSwiperHero();
  }, 1000);
}

async function initializeSenza() {
  try {
    await senza.init();
    initializeTiles();

    document.getElementById("progress-bar").style.width = "100%";
    setTimeout(() => {
      document.getElementById("loader").style.display = "none";
      document.getElementById("main").style.display = "block";
    }, 1000);

    senza.remotePlayer.addEventListener("ended", () => {
      senza.lifecycle.moveToForeground();
    });

    senza.uiReady();
  } catch (error) {
    console.error("Error initializing:", error);
  }
}

// Initialize Swiper for hero section
function initializeSwiperHero() {
  if (swiper) {
    swiper.destroy(true, true);
  }
  swiper = new Swiper(".swiper-container-hero", {
    effect: "coverflow",
    grabCursor: false,
    centeredSlides: true,
    slidesPerView: 2,
    coverflowEffect: {
      rotate: 10,
      stretch: 10,
      depth: 110,
      modifier: 5,
      slideShadows: true,
    },
    loop: true,
    pagination: {
      el: ".swiper-pagination",
    },
    autoplay: {
      delay: 2000,
      disableOnInteraction: true,
    },
  });
}

// Create sliders from fetched data
function createSliders(sliders) {
  const sliderList = document.querySelector(".swiper-wrapper");
  sliders.forEach((slide, index) => {
    const slideItem = createSliderElement(slide, index);
    sliderList.appendChild(slideItem);
  });
}

function createSliderElement(slide, index) {
  // Create the main slider item container
  const slideItem = document.createElement("div");
  slideItem.className = "swiper-slide";

  // Truncate the description text to 100 characters with ellipsis
  const truncatedDescription =
    slide.description.length > 150
      ? slide.description.slice(0, 150) + "..."
      : slide.description;

  // Set the inner HTML for the slide item
  slideItem.innerHTML = `
    <img class="imgCarousal" src="${slide.banner}" alt="${slide.title}" />
    <div class="slider-info">
      <h1 class="slider-title">${slide.title}</h1>
      <p class="slider-description">${truncatedDescription}</p>
      <button class="slider-button" data-index="${index}">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
        <div>${slide.cta || "Watch Now"}</div>
      </button>
    </div>
  `;

  // Set up the redirect URL based on the slide type
  slideItem.querySelector(".slider-button").addEventListener("click", () => {
    let redirectUrl;

    // Determine the redirection URL based on slide type
    switch (slide.type) {
      case "Live TV":
        redirectUrl = "pages/media.html";
        break;
      case "Movie":
      case "TV Series":
        redirectUrl = "pages/videos.html";
        break;
      case "Podcast":
      case "Radio":
        redirectUrl = "index.html";
        break;
      case "Other":
        redirectUrl = "pages/music.html";
        break;
      default:
        redirectUrl = "index.html";
    }

    // Redirect the user to the determined URL
    window.location.href = redirectUrl;
  });

  return slideItem;
}

// Initialize grid items (tiles) and their navigation
function initializeTiles() {
  const items = getItems();
  updateSelection(selectedIndex); // Initialize the first tile as selected

  items.forEach((item) => {
    item.addEventListener("click", () => {
      redirect(item.getAttribute("data-page"));
    });
  });
}

// Update the selected tile
function updateSelection(index) {
  const items = getItems();
  if (items.length === 0) return;

  deselectAll(); // Deselect all items before selecting the new one
  selectedIndex = (index + items.length) % items.length; // Ensure the index wraps around
  select(items[selectedIndex]); // Select the new one
  scrollToElement(items[selectedIndex]); // Scroll to the selected grid item
}

// Redirect to a specified page
function redirect(page) {
  if (page) {
    window.location.href = page; // Redirect to the specified page
  }
}

// Handle keydown events for navigation
document.addEventListener("keydown", (event) => {
  // Check if the modal is open
  if (isModalOpen) {
    return; // Skip further processing if the modal is open
  }

  switch (event.key) {
    case "Enter":
      handleEnterKey();
      break;
    case "Escape":
      goBack();
      break;
    case "ArrowUp":
    case "ArrowDown":
      handleVerticalNavigation(event.key);
      break;
    case "ArrowLeft":
    case "ArrowRight":
      handleArrowNavigation(event.key);
      break;
    default:
      return;
  }
  event.preventDefault();
});

// Handle Enter key to select the current option
function handleEnterKey() {
  switch (currentSection) {
    case "settings_profile":
      if (
        document.getElementById("profile-button").classList.contains("selected")
      ) {
        openLoginModal();
      } else if (
        document
          .getElementById("settings-button")
          .classList.contains("selected")
      ) {
        redirect("pages/settings.html");
      }
      break;
    case "slider":
      clickActiveSliderButton();
      break;
    case "grid":
      clickActiveGridItem();
      break;
  }
}

function clickActiveSliderButton() {
  const activeSlide = document.querySelector(".swiper-slide-active");
  if (activeSlide) {
    const watchNowButton = activeSlide.querySelector(".slider-button");
    if (watchNowButton) {
      watchNowButton.click();
    }
  }
}

function clickActiveGridItem() {
  const items = getItems();
  if (items[selectedIndex]) {
    redirect(items[selectedIndex].getAttribute("data-page"));
  }
}

// Handle navigation with arrow keys
function handleVerticalNavigation(key) {
  if (key === "ArrowUp") {
    if (currentSection === "grid") {
      navigateToSlider();
    } else if (currentSection === "slider") {
      navigateToSettingsProfile();
    }
  } else if (key === "ArrowDown") {
    if (currentSection === "settings_profile") {
      navigateToSlider();
    } else if (currentSection === "slider") {
      navigateToGrid();
    }
  }
}

function navigateToSlider() {
  currentSection = "slider";
  deselectAll();
  selectSliderButton();
  scrollToElement(document.querySelector(".swiper-container-hero"));
}

function navigateToSettingsProfile() {
  currentSection = "settings_profile";
  deselectAll();
  selectSettingsButton(); // Start with selecting settings
  scrollToElement(document.getElementById("settings-button"));
}

function navigateToGrid() {
  currentSection = "grid";
  deselectAll();
  updateSelection(0);
  scrollToElement(document.getElementById("grid-container"));
}

function handleArrowNavigation(key) {
  if (currentSection === "settings_profile") {
    handleSettingsProfileNavigation(key); // Call header.js function
  } else if (currentSection === "slider") {
    navigateSlider(key);
  } else if (currentSection === "grid") {
    navigateGrid(key);
  }
}

function navigateSlider(key) {
  if (key === "ArrowLeft") {
    swiper.slidePrev();
    currentSliderIndex =
      (currentSliderIndex - 1 + swiper.slides.length) % swiper.slides.length;
  } else if (key === "ArrowRight") {
    swiper.slideNext();
    currentSliderIndex = (currentSliderIndex + 1) % swiper.slides.length;
  }
  selectSliderButton();
}

function navigateGrid(key) {
  const step = key === "ArrowLeft" ? -1 : 1;
  navigate(step);
}

function navigate(step) {
  const items = getItems();
  if (items.length === 0) return;

  const newIndex = (selectedIndex + step + items.length) % items.length;
  updateSelection(newIndex);
  scrollToElement(items[selectedIndex]);
}

// Helper functions
function select(item) {
  item.classList.add("selected");
}

function deselectSettingsButton() {
  const settingsButton = document.getElementById("settings-button");
  if (settingsButton) {
    settingsButton.classList.remove("selected");
  }
}

function deselectProfileButton() {
  const profileButton = document.getElementById("profile-button");
  if (profileButton) {
    profileButton.classList.remove("selected");
  }
}

function deselectAll() {
  const items = getItems();
  items.forEach((item) => item.classList.remove("selected"));
  deselectSlider();
  deselectSettingsButton();
  deselectProfileButton();
}

function deselectSlider() {
  const activeSlide = document.querySelector(".swiper-slide-active");
  if (activeSlide) {
    const button = activeSlide.querySelector(".slider-button");
    if (button) button.classList.remove("selected");
  }
}

function selectSliderButton() {
  const activeSlide = document.querySelector(".swiper-slide-active");
  if (activeSlide) {
    const button = activeSlide.querySelector(".slider-button");
    if (button) button.classList.add("selected");
  }
}

function scrollToElement(element) {
  element.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "center",
  });
}

function getItems() {
  return Array.from(document.getElementsByClassName("grid-item"));
}
