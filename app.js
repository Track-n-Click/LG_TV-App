// Function to initialize Swiper for the Hero section
function initializeSwiperHero() {
  if (document.querySelector(".swiper-container-hero")) {
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
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      autoplay: {
        delay: 2000,
        disableOnInteraction: true,
      },
    });
  }
}

// Generalized Swiper initialization function
function initializeSwiper(containerClass, slidesPerView, spaceBetween) {
  return new Swiper(containerClass, {
    grabCursor: true,
    slidesPerView: slidesPerView,
    spaceBetween: spaceBetween,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
}

// Initialize Swipers for different sections
function initializeAllSwipers() {
  initializeSwiperHero();
  initializeSwiper(".swiper-container-channels", 6, 10);
  initializeSwiper(".swiper-container-movies", 5, 30);
  initializeSwiper(".swiper-container-series", 5, 10);
}

// Fetch data and create sliders
async function fetchDataAndInitialize() {
  await fetchSliders();
  await fetchChannels();
  await fetchMovies();
  await fetchTvSeries();
  initializeAllSwipers();
}

// Document ready function
document.addEventListener("DOMContentLoaded", function () {
  // Initialize profile and login related functions
  initializeProfileAndLogin();

  // Fetch data and initialize Swipers
  fetchDataAndInitialize();
});

// Profile and login related functions
function initializeProfileAndLogin() {
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

    profileContainer.innerHTML = ""; // Clear existing content

    if (isLoggedIn) {
      const profileIcon = document.createElement("i");
      profileIcon.className = "fa-regular fa-user";
      profileContainer.appendChild(profileIcon);

      submenu.innerHTML = ""; // Clear existing submenu items

      const logoutItem = document.createElement("div");
      logoutItem.className = "submenu-item";
      logoutItem.innerText = "Logout";
      logoutItem.onclick = logout;

      const profileItem = document.createElement("div");
      profileItem.className = "submenu-item";
      profileItem.innerText = "Profile";

      submenu.appendChild(profileItem);
      submenu.appendChild(logoutItem);

      profileContainer.appendChild(submenu);
      profileContainer.onclick = toggleSubmenu;
    } else {
      const loginButton = document.createElement("button");
      loginButton.className = "login-button";
      loginButton.innerText = "LOGIN";
      loginButton.onclick = openLoginModal;
      profileContainer.appendChild(loginButton);
    }
  }

  // Open login modal
  function openLoginModal() {
    loginModal.style.display = "block";
  }

  // Close login modal
  closeModal.onclick = function () {
    loginModal.style.display = "none";
  };

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
    const username = document.getElementById("email").value;
    localStorage.setItem("user", email);

    loginModal.style.display = "none"; // Close modal
    checkLoginStatus(); // Update UI after logging in
  };

  checkLoginStatus();
}

// Fetch and create sliders
async function fetchSliders() {
  try {
    const response = await fetch(
      "https://c-1y15z120-t12c.ayozat.com/api/home/slider"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const sliders = data.data;

    // Call the function to create sliders
    createSliders(sliders);
  } catch (error) {
    console.error("Error fetching Sliders:", error);
  }
}

// Fetch and create channels
async function fetchChannels() {
  try {
    const response = await fetch(
      "https://c-1y15z120-t12c.ayozat.com/api/tv-channels/featured"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const channels = data.data;

    // Call the function to create channel cards
    createChannelCards(channels);
  } catch (error) {
    console.error("Error fetching Channels:", error);
  }
}

// Fetch and create movies
async function fetchMovies() {
  try {
    const response = await fetch(
      "https://c-1y15z120-t12c.ayozat.com/api/movies/random"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const movies = data.data;

    // Call the function to create movie cards
    createMovieCards(movies);
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

// Fetch and create series
async function fetchTvSeries() {
  try {
    const response = await fetch(
      "https://c-1y15z120-t12c.ayozat.com/api/tv-series/random"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const TVseries = data.data;

    // Call the function to create movie cards
    createSeriesCards(TVseries);
  } catch (error) {
    console.error("Error fetching TV series:", error);
  }
}

// Function to create sliders
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

// Function to create channel cards
function createChannelCards(channels) {
  const channelList = document.querySelector(".channel-list");

  channels.forEach((channel) => {
    const channelItem = document.createElement("div");
    channelItem.className = "swiper-slide channel-list-item";

    channelItem.innerHTML = `
      <img class="channel-list-item-img" src="${channel.thumbnail}" alt="${channel.name}" />
      <span class="channel-list-item-title">${channel.name}</span>
    `;

    // Add click event listener to the channel title to navigate to the corresponding page
    channelItem
      .querySelector(".channel-list-item-title")
      .addEventListener("click", () => {
        const formattedTitle = channel.slug.toLowerCase().split(" ").join("-");
        window.location.href = `videoDetailsPage.html?slug=${formattedTitle}`;
      });

    channelList.appendChild(channelItem);
  });
}

// Function to create movie cards
function createMovieCards(movies) {
  const movieList = document.querySelector(".movie-list");

  movies.forEach((movie) => {
    const movieItem = document.createElement("div");
    movieItem.className = "swiper-slide movie-list-item";

    movieItem.innerHTML = `
      <img class="movie-list-item-img" src="${movie.thumbnail}" alt="${
      movie.title
    }" />
    <div class="overlay"></div>
      <span class="movie-list-item-title">${movie.title}</span>
      <button class="movie-list-item-button" onclick="playMovie('${movie.slug
        .replace(/'/g, "\\'")
        .replace(/"/g, "&quot;")}')">
        <i class="fas fa-play-circle"></i>
      </button>
    `;

    // Add click event listener to the movie title to navigate to the corresponding page
    movieItem
      .querySelector(".movie-list-item-title")
      .addEventListener("click", () => {
        // const formattedTitle = movie.title.toLowerCase().split(" ").join("-");
        window.location.href = `videoDetailsPage.html?title=${movie.slug}`;
      });

    movieList.appendChild(movieItem);
  });
}

// Function to create series cards
function createSeriesCards(TVseries) {
  const seriesList = document.querySelector(".series-list");

  TVseries.forEach((series) => {
    const seriesItem = document.createElement("div");
    seriesItem.className = "swiper-slide movie-list-item";

    seriesItem.innerHTML = `
    
    <img class="movie-list-item-img" src="${series.thumbnail}" alt="${
      series.title
    }" />
    <div class="overlay"></div>
    <button class="movie-list-item-button" onclick="playMovie('${series.slug
      .replace(/'/g, "\\'")
      .replace(/"/g, "&quot;")}')">
      <i class="fas fa-play-circle"></i>
    </button>
    <span class="movie-list-item-title">${series.title}</span>

    `;

    // Add click event listener to the series title to navigate to the corresponding page
    seriesItem
      .querySelector(".movie-list-item-title")
      .addEventListener("click", () => {
        const formattedTitle = series.title.toLowerCase().split(" ").join("-");
        window.location.href = `videoDetailsPage.html?title=${series.slug}`;
      });

    seriesList.appendChild(seriesItem);
  });
}
