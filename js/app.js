import { fetchSliders } from "./mediaService.js";

let selectedIndex = 0;
let settingsSelected = false;
let currentSection = 'slider'; // Possible values: 'settings', 'slider', 'grid'
let swiper; 
let currentSliderIndex = 0;

document.addEventListener("DOMContentLoaded", async () => {
  setTimeout(async () => {
    const sliders = await fetchSliders();
    createSliders(sliders);
    initializeSwiperHero();
  }, 1000);
});

window.addEventListener("load", async () => {
  try {
    await senza.init();
    initializeTiles();

    document.getElementById("progress-bar").style.width = "100%";
    setTimeout(function () {
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
});

function initializeSwiperHero() {
  if (typeof swiper !== 'undefined') {
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

function createSliders(sliders) {
  const sliderList = document.querySelector(".swiper-wrapper");

  sliders.forEach((slide, index) => {
    const slideItem = document.createElement("div");
    slideItem.className = "swiper-slide";

    slideItem.innerHTML = `
      <img class="imgCarousal" src="${slide.banner}" alt="${slide.title}"/>
      <div class="slider-info">
        <h1 class="slider-title">${slide.title}</h1>
        <p class="slider-description">${slide.description}</p>
        <button class="slider-button" data-index="${index}">Watch Now</button>
      </div>
    `;

    sliderList.appendChild(slideItem);

    // Add event listener to redirect when "Watch Now" button is clicked
    slideItem.querySelector(".slider-button").addEventListener("click", () => {
      redirect("pages/media.html");
    });
  });
}

function initializeTiles() {
  const items = getItems();
  updateSelection(selectedIndex); // Initialize the first tile as selected

  items.forEach((item, index) => {
    item.addEventListener("click", () => {
      redirect(item.getAttribute("data-page"));
    });
  });

  // Add click listener for the settings button
  document.getElementById("settings-button").addEventListener("click", () => {
    redirect("pages/settings.html");
  });
}

function updateSelection(index) {
  const items = getItems();
  if (items.length === 0) return;

  deselectAll(); // Deselect all items before selecting the new one
  if (settingsSelected) {
    selectSettingsButton(); // Select the settings button if settingsSelected is true
  } else {
    selectedIndex = (index + items.length) % items.length; // Ensure the index wraps around
    select(items[selectedIndex]); // Select the new one
    scrollToElement(items[selectedIndex]); // Scroll to the selected grid item
  }
}

function redirect(page) {
  if (page) {
    window.location.href = page; // Redirect to the specified page
  }
}

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "Enter":
      handleEnterKey();
      break;
    case "Escape":
      goBack();
      break;
    case "ArrowUp":
      handleArrowUp();
      break;
    case "ArrowDown":
      handleArrowDown();
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

function handleEnterKey() {
  if (currentSection === 'settings') {
    redirect("pages/settings.html");
  } else if (currentSection === 'slider') {
    const activeSlide = document.querySelector(".swiper-slide-active");
    if (activeSlide) {
      const watchNowButton = activeSlide.querySelector(".slider-button");
      if (watchNowButton) {
        watchNowButton.click();
      }
    }
  } else if (currentSection === 'grid') {
    const items = getItems();
    if (items[selectedIndex]) {
      redirect(items[selectedIndex].getAttribute("data-page"));
    }
  }
}

function handleArrowUp() {
  if (currentSection === 'grid') {
    currentSection = 'slider';
    deselectAll();
    selectSliderButton();
    scrollToElement(document.querySelector('.swiper-container-hero')); // Scroll to slider
  } else if (currentSection === 'slider') {
    currentSection = 'settings';
    deselectAll();
    selectSettingsButton();
    scrollToElement(document.getElementById("settings-button")); // Scroll to settings button
  }
}

function handleArrowDown() {
  if (currentSection === 'settings') {
    currentSection = 'slider';
    deselectAll();
    selectSliderButton();
    scrollToElement(document.querySelector('.swiper-container-hero')); // Scroll to slider
  } else if (currentSection === 'slider') {
    currentSection = 'grid';
    deselectAll();
    updateSelection(0);
    scrollToElement(document.getElementById("grid-container")); // Scroll to grid
  }
}

function handleArrowNavigation(key) {
  if (currentSection === 'settings') {
    return; // No left/right navigation in settings
  } else if (currentSection === 'slider') {
    if (key === 'ArrowLeft') {
      swiper.slidePrev();
      currentSliderIndex = (currentSliderIndex - 1 + swiper.slides.length) % swiper.slides.length;
      selectSliderButton(); // Highlight "Watch Now" button
    } else if (key === 'ArrowRight') {
      swiper.slideNext();
      currentSliderIndex = (currentSliderIndex + 1) % swiper.slides.length;
      selectSliderButton(); // Highlight "Watch Now" button
    }
  } else if (currentSection === 'grid') {
    const step = key === "ArrowLeft" ? -1 : 1;
    navigate(step);
  }
}

function navigate(step) {
  const items = getItems();
  if (items.length === 0) return;

  const newIndex = (selectedIndex + step + items.length) % items.length;
  updateSelection(newIndex);
  scrollToElement(items[selectedIndex]);
}

function select(item) {
  item.classList.add("selected");
}

function deselectAll() {
  const items = getItems();
  items.forEach((item) => item.classList.remove("selected"));
  deselectSettingsButton();
  deselectSlider();
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

function selectSettingsButton() {
  const settingsButton = document.getElementById("settings-button");
  settingsButton.classList.add("selected");
}

function deselectSettingsButton() {
  const settingsButton = document.getElementById("settings-button");
  settingsButton.classList.remove("selected");
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

// Loader functionality
window.addEventListener("load", function () {
  const progressBar = document.getElementById("progress-bar");
  progressBar.style.width = "100%";
  setTimeout(function () {
    document.getElementById("loader").style.display = "none";
    document.getElementById("main").style.display = "block";
  }, 4000); // Adjust timing as needed
});