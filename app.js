function initializeSwiperHero() {
  var swiper = new Swiper(" .swiper-container", {
    effect: "coverflow",
    grabCursor: false,
    centeredSlides: true,
    slidesPerView: 2,
    coverflowEffect: {
      rotate: 10,
      stretch: 10,
      depth: 100,
      modifier: 5,
      slideShadows: true,
    },
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    autoplay: {
      delay: 1500,
      disableOnInteraction: true,
    },
  });
}

function initializeSwiper2() {
  var mySwiper = new Swiper(" .swiper-container", {
    effect: "coverflow",
    grabCursor: false,
    centeredSlides: true,
    slidesPerView: 2,
    coverflowEffect: {
      rotate: 10,
      stretch: 10,
      depth: 100,
      modifier: 5,
      slideShadows: true,
    },
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    autoplay: {
      delay: 1500,
      disableOnInteraction: true,
    },
  });
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
      profileContainer.appendChild(profileIcon);

      submenu.innerHTML = ""; // Clear existing submenu items

      const logoutItem = document.createElement("div");
      logoutItem.className = "submenu-item";
      logoutItem.innerText = "Logout";
      logoutItem.onclick = logout;

      const profileItem = document.createElement("div");
      profileItem.className = "submenu-item";
      profileItem.innerText = "Profile";
      // profileItem.onclick = logout;

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
});

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
    // Initialize the swiper after images are loaded
    initializeSwiperHero();
  } catch (error) {
    console.error("Error fetching Sliders:", error);
  }
}

async function fetchChannels() {
  try {
    const response = await fetch(
      "https://c-1y15z120-t12c.ayozat.com/api/tv-channels/featured"
    );

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Assuming the channels data is stored in response.data
    const channels = data.data;

    // Call the function to create channel cards
    createChannelCards(channels);
  } catch (error) {
    console.error("Error fetching Channels:", error);
  }
}
async function fetchMovies() {
  try {
    const response = await fetch(
      "https://c-1y15z120-t12c.ayozat.com/api/movies/random"
    );

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Assuming the movies data is stored in response.data
    const movies = data.data;

    // Call the function to create movie cards
    createMovieCards(movies);
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

async function fetchTvSeries() {
  try {
    const response = await fetch(
      "https://c-1y15z120-t12c.ayozat.com/api/tv-series/random"
    );

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Assuming the movies data is stored in response.data
    const TVseries = data.data;

    // Call the function to create movie cards
    createSeriesCards(TVseries);
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

function createSliders(sliders) {
  const sliderList = document.querySelector(".swiper-wrapper");

  // Iterate over the movie data and create movie cards dynamically
  sliders.forEach((slide) => {
    const slideItem = document.createElement("div");
    slideItem.className = "swiper-slide";

    slideItem.innerHTML = `
      <img class="imgCarousal" src="${slide.banner}" alt="${slide.title}"/>
    `;

    sliderList.appendChild(slideItem);
  });
}

function createChannelCards(channels) {
  const channelList = document.querySelector(".channel-list");

  // Iterate over the movie data and create movie cards dynamically
  channels.forEach((channel) => {
    const channelItem = document.createElement("div");
    channelItem.className = "channel-list-item ";

    channelItem.innerHTML = `
      <img class="channel-list-item-img" src="${channel.thumbnail}" alt="${channel.name}" />
      <span class="channel-list-item-title">${channel.name}</span>
    `;

    // Add click event listener to the channel title to navigate to the corresponding page
    channelItem
      .querySelector(".channel-list-item-title")
      .addEventListener("click", () => {
        const formattedTitle = channel.title.toLowerCase().split(" ").join("-");
        window.location.href = `videoDetailsPage.html?title=${formattedTitle}`;
      });

    channelList.appendChild(channelItem);
  });
}

function createMovieCards(movies) {
  const movieList = document.querySelector(".movie-list");

  // Iterate over the movie data and create movie cards dynamically
  movies.forEach((movie) => {
    const movieItem = document.createElement("div");
    movieItem.className = "movie-list-item";

    movieItem.innerHTML = `
      <img class="movie-list-item-img" src="${movie.thumbnail}" alt="${
      movie.title
    }" />
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
        const formattedTitle = movie.title.toLowerCase().split(" ").join("-");
        window.location.href = `videoDetailsPage.html?title=${formattedTitle}`;
      });

    movieList.appendChild(movieItem);
  });
}

// Function to create series cards dynamically
function createSeriesCards(TVseries) {
  const seriesList = document.querySelector(".series-list");

  // Iterate over the series data and create movie cards dynamically
  TVseries.forEach((series) => {
    const seriesItem = document.createElement("div");
    seriesItem.className = "movie-list-item";

    seriesItem.innerHTML = `
      <img class="movie-list-item-img" src="${series.thumbnail}" alt="${
      series.title
    }" />
      <span class="movie-list-item-title">${series.title}</span>
      <button class="movie-list-item-button" onclick="playMovie('${series.slug
        .replace(/'/g, "\\'")
        .replace(/"/g, "&quot;")}')">
        <i class="fas fa-play-circle"></i>
      </button>
    `;

    // Add click event listener to the movie title to navigate to the corresponding page
    seriesItem
      .querySelector(".movie-list-item-title")
      .addEventListener("click", () => {
        const formattedTitle = series.title.toLowerCase().split(" ").join("-");
        window.location.href = `videoDetailsPage.html?title=${formattedTitle}`;
      });

    seriesList.appendChild(seriesItem);
  });
}

// Call the function to fetch when the page loads
fetchMovies();
fetchTvSeries();
fetchChannels();
fetchSliders();

function playMovie(slug) {
  window.location.href = `videoPlayer.html?slug=${slug}`;
}
