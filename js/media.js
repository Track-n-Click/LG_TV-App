import {
  fetchMovies,
  fetchTVSeries,
  fetchTVChannels,
  fetchSliders,
} from "./mediaService.js";

document.addEventListener("DOMContentLoaded", async () => {
  setTimeout(async () => {
    displayPlaceholders("channels-row");
    const tvChannels = await fetchTVChannels();
    replacePlaceholdersWithData("channels-row", tvChannels);

    displayPlaceholders("movie-row");
    const movies = await fetchMovies();
    replacePlaceholdersWithData("movie-row", movies);

    displayPlaceholders("tv-row");
    const tvSeries = await fetchTVSeries();
    replacePlaceholdersWithData("tv-row", tvSeries);

    initializeMediaNavigation();
    const sliders = await fetchSliders();
    createSliders(sliders);

    initializeSwiperHero();
  }, 1000);
});

function initializeSwiperHero() {
  var swiper = new Swiper(".swiper-container-hero", {
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
    // navigation: {
    //   nextEl: ".swiper-button-next",
    //   prevEl: ".swiper-button-prev",
    // },
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

  // Iterate over the movie data and create movie cards dynamically
  sliders.forEach((slide) => {
    const slideItem = document.createElement("div");
    slideItem.className = "swiper-slide";

    slideItem.innerHTML = `
      <img class="imgCarousal" src="${slide.banner}" alt="${slide.title}"/>
      <div class="slider-info">
      <h1 class="slider-title">${slide.title}</h1>
      <p class="slider-description">${slide.description}</p>
      <button class="slider-button">Watch Now</button></div>
      
    `;

    sliderList.appendChild(slideItem);
  });
}

// Loader functionality
window.addEventListener("load", function () {
  const progressBar = document.getElementById("progress-bar");
  progressBar.style.width = "100%";
  setTimeout(function () {
    document.getElementById("loader").style.display = "none";
    document.getElementById("main").style.display = "block";
  }, 1000);
});

function displayPlaceholders(rowId) {
  const row = document.getElementById(rowId);
  for (let i = 0; i < 7; i++) {
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

function replacePlaceholdersWithData(rowId, mediaItems) {
  const row = document.getElementById(rowId);
  row.innerHTML = ""; // Clear placeholders

  mediaItems.forEach((item, index) => {
    const tile = document.createElement("div");
    tile.classList.add("video-tile");
    tile.setAttribute("data-index", index);
    tile.setAttribute("data-url", item.poster); // Assuming poster is the URL for playback
    tile.innerHTML = `
            <img src="${item.thumbnail}" alt="${item.title}">
            <div class="title">${item.title || item.name}</div>
        `;
    row.appendChild(tile);
  });
}

function initializeMediaNavigation() {
  let selectedSectionIndex = 0;
  let selectedItemIndex = 0;
  const mediaSections = [
    "navbar-container",
    "swiper-wrapper",
    "channels-row",
    "movie-row",
    "tv-row",
  ];

  if (mediaSections.length > 0) {
    const firstRow = document.getElementById(
      mediaSections[selectedSectionIndex]
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
      mediaSections[selectedSectionIndex]
    );
    const currentTiles = currentRow.querySelectorAll(
      ".video-tile, .menu-list-item, .swiper-slide"
    );

    if (currentTiles.length > 0) {
      currentTiles[selectedItemIndex].classList.remove("selected");
    }

    selectedSectionIndex =
      (selectedSectionIndex + step + mediaSections.length) %
      mediaSections.length;
    selectedItemIndex = 0; // Reset item index to 0 when moving to a new section

    const newRow = document.getElementById(mediaSections[selectedSectionIndex]);
    const newTiles = newRow.querySelectorAll(
      ".video-tile, .menu-list-item, .swiper-slide"
    );

    if (newTiles.length > 0) {
      newTiles[selectedItemIndex].classList.add("selected");
      scrollToSection(newRow);
    }
  }

  function navigateItems(step) {
    const currentRow = document.getElementById(
      mediaSections[selectedSectionIndex]
    );
    const currentTiles = currentRow.querySelectorAll(
      ".video-tile, .menu-list-item"
    );

    if (currentTiles.length > 0) {
      currentTiles[selectedItemIndex].classList.remove("selected");
      selectedItemIndex =
        (selectedItemIndex + step + currentTiles.length) % currentTiles.length;
      currentTiles[selectedItemIndex].classList.add("selected");

      scrollToTile(currentRow, currentTiles[selectedItemIndex]);
    }
  }

  function playSelectedVideo() {
    const selectedTile = document.querySelector(".video-tile.selected");
    const videoUrl = selectedTile.getAttribute("data-url");
    toggleVideo(videoUrl);
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
}

async function toggleVideo(url) {
  const currentState = await senza.lifecycle.getState();
  if (
    currentState === "background" ||
    currentState === "inTransitionToBackground"
  ) {
    senza.lifecycle.moveToForeground();
  } else {
    await playVideo(url);
  }
}

async function playVideo(url) {
  try {
    await senza.remotePlayer.load(url);
    senza.remotePlayer.play();
  } catch (error) {
    console.log("Couldn't load remote player.", error);
  }
}

function goBack() {
  window.history.back();
}

document.addEventListener("DOMContentLoaded", function () {
  const profileContainer = document.getElementById("profile-container");
  const submenu = document.createElement("div");
  submenu.className = "submenu";
  submenu.id = "submenu";
  profileContainer.appendChild(submenu);

  const loginModal = document.getElementById("login-modal");
  const closeModal = document.getElementById("close-modal");

  // Check if the user is logged in
  function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem("user");

    console.log(isLoggedIn);
    profileContainer.innerHTML = ""; // Clear existing content

    if (isLoggedIn) {
      const profileIcon = document.createElement("i");
      profileIcon.className = "fa-regular fa-user";
      profileIcon.tabIndex = 0; // Make the icon focusable
      profileContainer.appendChild(profileIcon);

      submenu.innerHTML = ""; // Clear existing submenu items

      const logoutItem = document.createElement("div");
      logoutItem.className = "submenu-item";
      logoutItem.tabIndex = 0; // Make the item focusable
      logoutItem.innerText = "Logout";
      logoutItem.onkeypress = function (e) {
        if (e.key === "Enter") logout();
      };

      const profileItem = document.createElement("div");
      profileItem.className = "submenu-item";
      profileItem.tabIndex = 0; // Make the item focusable
      profileItem.innerText = "Profile";
      // Add event handler for Profile if needed

      submenu.appendChild(profileItem);
      submenu.appendChild(logoutItem);

      profileContainer.appendChild(submenu);
      profileContainer.onkeypress = function (e) {
        if (e.key === "Enter") toggleSubmenu();
      };
    } else {
      const loginButton = document.createElement("button");
      loginButton.className = "login-button";
      loginButton.tabIndex = 0;
      loginButton.innerText = "LOGIN";
      loginButton.onkeypress = function (e) {
        if (e.key === "Enter") openLoginModal();
      };
      profileContainer.appendChild(loginButton);
    }
  }

  // Open login modal
  function openLoginModal() {
    console.log("Opened");
    loginModal.style.display = "block";
  }

  // Close login modal with Escape key
  closeModal.onkeypress = function (e) {
    if (e.key === "Enter" || e.key === "Escape") {
      loginModal.style.display = "none";
    }
  };

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      loginModal.style.display = "none";
      submenu.style.display = "none";
    }
  });

  // Logout function
  function logout() {
    localStorage.removeItem("user");
    checkLoginStatus(); // Update UI after logging out
  }

  // Toggle submenu visibility
  function toggleSubmenu() {
    submenu.style.display =
      submenu.style.display === "block" ? "none" : "block";
  }

  // Close the submenu if clicked outside
  document.addEventListener("click", function (event) {
    if (!profileContainer.contains(event.target)) {
      submenu.style.display = "none";
    }
  });

  // Handle login form submission
  document.getElementById("login-form").onsubmit = function (event) {
    event.preventDefault();

    // Mock login: just save username in local storage
    const email = document.getElementById("email").value;
    localStorage.setItem("user", email);

    loginModal.style.display = "none"; // Close modal
    checkLoginStatus(); // Update UI after logging in
  };

  checkLoginStatus();
});
