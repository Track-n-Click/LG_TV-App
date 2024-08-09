function initializeSwiperHero() {
  var swiper = new Swiper(".swiper-container-hero", {
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
  var mySwiper = new Swiper(".swiper-container-channels", {
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 8,
    spaceBetween: 10,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    autoplay: {
      delay: 1500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
}

function initializeSwiper3() {
  var mySwiper = new Swiper(".swiper-container-movies", {
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 6,
    spaceBetween: 10,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    autoplay: {
      delay: 1500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
}

function initializeSwiper4() {
  var mySwiper = new Swiper(".swiper-container-series", {
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 6,
    spaceBetween: 10,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    autoplay: {
      delay: 1500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
}

function initializeSwiper5() {
  var mySwiper = new Swiper(".swiper-container-related", {
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 6,
    spaceBetween: 5,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    // autoplay: {
    //   delay: 1500,
    //   disableOnInteraction: false,
    // },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
}

function initializeSwiper6() {
  var mySwiper = new Swiper(".swiper-container-episode", {
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 6,
    spaceBetween: 5,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    // autoplay: {
    //   delay: 1500,
    //   disableOnInteraction: false,
    // },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
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
    // Initialize the swiper after images are loaded
    initializeSwiper2();
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
    // Initialize the swiper after images are loaded
    initializeSwiper3();
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
    // Initialize the swiper after images are loaded
    initializeSwiper4();
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

async function fetchMoviesDetails() {
  const url = new URL(window.location.href);
  const title = url.searchParams.get("title");

  if (title) {
    try {
      const response = await fetch(
        `https://c-1y15z120-t12c.ayozat.com/api/movies/${title}`
      );

      // Check if the response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Assuming the movie and series details is stored in response.data
      const VideoDetailsData = data.data;
      //   // Call the function to create movie cards
      createVideoDetails(VideoDetailsData);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }
}

async function fetchSeriesDetails() {
  const url = new URL(window.location.href);
  const title = url.searchParams.get("title");

  if (title) {
    try {
      const response = await fetch(
        `https://c-1y15z120-t12c.ayozat.com/api/tv-series/${title}`
      );

      // Check if the response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Assuming the movie and series details is stored in response.data
      const VideoDetailsData = data.data;
      const EpisodeData = data.data.seasons;

      // Call the function to create movie cards
      createVideoDetails(VideoDetailsData);
      createEpisodeCards(EpisodeData);
      // Initialize the swiper after images are loaded
      initializeSwiper6();
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }
}

async function fetchRelatedVideos() {
  const url = new URL(window.location.href);
  const title = url.searchParams.get("title");

  if (title) {
    try {
      const response = await fetch(
        `https://c-1y15z120-t12c.ayozat.com/api/movies/related/${title}`
      );

      // Check if the response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Assuming the movie and series details is stored in response.data
      const RelatedVideos = data.data;

      // Call the function to create movie cards
      createRelatedMoviesCards(RelatedVideos);
      // Initialize the swiper after images are loaded
      initializeSwiper5();
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }
}

async function fetchRelatedSeries() {
  const url = new URL(window.location.href);
  const title = url.searchParams.get("title");

  if (title) {
    try {
      const response = await fetch(
        `https://c-1y15z120-t12c.ayozat.com/api/tv-series/related/${title}`
      );

      // Check if the response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Assuming the movie and series details is stored in response.data
      const RelatedSeries = data.data;

      // Call the function to create movie cards
      createRelatedMoviesCards(RelatedSeries);
      // Initialize the swiper after images are loaded
      initializeSwiper5();
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
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
    channelItem.className = "swiper-slide channel-list-item";

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
    movieItem.className = "swiper-slide movie-list-item";

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
        // const formattedTitle = movie.title.toLowerCase().split(" ").join("-");
        window.location.href = `videoDetailsPage.html?title=${movie.slug}`;
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
    seriesItem.className = "swiper-slide movie-list-item";

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
        window.location.href = `videoDetailsPage.html?title=${series.slug}`;
      });

    seriesList.appendChild(seriesItem);
  });
}

// Function to create video details cards dynamically
function createVideoDetails(VideoDetailsData) {
  const videoDetailsList = document.querySelector(".hero-content-container");

  const backgroundItem = document.createElement("div");
  backgroundItem.className = "hero-container";

  backgroundItem.innerHTML = `
    <img class="hero-image" src="${
      VideoDetailsData.thumbnail_url || VideoDetailsData.thumbnail
    }" alt="${VideoDetailsData.title}" />
  `;

  const detailsItems = document.createElement("div");
  detailsItems.className = "details-container";

  detailsItems.innerHTML = `
    <img class="channel-logo" src="${VideoDetailsData.channel_logo_url}" alt="${
    VideoDetailsData.channel_name
  }" />
    <div class="hero-details">
      <h1 class="hero-title">${VideoDetailsData.title}</h1>
      <p class="hero-description">${VideoDetailsData.description}</p>
    </div>
    <div class="details-button-container">
      <div class="details-fav-icon">
        <i class="fa-regular fa-heart"></i>
      </div>
      <button class="details-play-button">${
        VideoDetailsData?.seasons ? "Play Series" : "Play Movie"
      }</button>
    </div>
  `;

  const EpisodeSection = document.querySelector(".episode-section");

  if (VideoDetailsData?.seasons && VideoDetailsData?.seasons.length > 0) {
    // Ensure the section is visible
    EpisodeSection.style.display = "block"; // or remove the 'hidden' class if using Tailwind CSS
  } else {
    // If no seasons data, hide the section
    EpisodeSection.style.display = "none"; // or add the 'hidden' class if using Tailwind CSS
  }

  videoDetailsList.appendChild(backgroundItem);
  videoDetailsList.appendChild(detailsItems);
}

function createRelatedMoviesCards(RelatedVideos) {
  const relatedList = document.querySelector(".related-section");

  // Iterate over the related videos and create movie cards dynamically
  RelatedVideos.forEach((relatedMovie) => {
    const relatedItem = document.createElement("div");
    relatedItem.className = "episode-list-item swiper-slide";

    relatedItem.innerHTML = `
      <img class="episode-list-item-img" src="${relatedMovie.thumbnail}" alt="${relatedMovie.title}" />
      <span class="episode-list-item-title">${relatedMovie.title}</span>
    `;

    // Add click event listener to the movie title to navigate to the corresponding page
    relatedItem
      .querySelector(".episode-list-item-title")
      .addEventListener("click", () => {
        window.location.href = `videoDetailsPage.html?title=${relatedMovie.slug}`;
      });

    relatedList.appendChild(relatedItem);
  });
}

function createEpisodeCards(EpisodeData) {
  const seasonList = document.querySelector(".episode-section");
  const episodeList = document.querySelector(".all-episode");

  EpisodeData.forEach((season) => {
    // Create a container for each season
    seasonList.innerHTML = `<h1 class="episode-list-title">${season.name}</h1>`;

    // Iterate through each episode
    season.episodes.forEach((episode) => {
      const episodeItem = document.createElement("div");
      episodeItem.className = "episode-list-item swiper-slide";

      episodeItem.innerHTML = `
        <img class="episode-list-item-img" src="${episode.thumbnail}" alt="${episode.title}" />
        <span class="episode-list-item-title">${episode.title}</span>
      `;

      // Add click event listener to the episode title to navigate to the corresponding page
      episodeItem
        .querySelector(".episode-list-item-title")
        .addEventListener("click", () => {
          window.location.href = `videoDetailsPage.html?title=${episode.slug}`;
        });

      // Append the episode item to the season container
      episodeList.appendChild(episodeItem);
    });

    // Append the season container to the season list
    seasonList.appendChild(episodeList);
  });
}

fetchMovies();
fetchTvSeries();
fetchChannels();
fetchSliders();
fetchMoviesDetails();
fetchSeriesDetails();
fetchRelatedVideos();
fetchRelatedSeries();

function playMovie(slug) {
  window.location.href = `videoPlayer.html?slug=${slug}`;
}
