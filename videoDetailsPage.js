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

function initializeAllSwipers() {
  initializeSwiper(".swiper-container-related", 5, 30);
  initializeSwiper(".swiper-container-episode", 5, 30);
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

    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }
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
      <div class="overlay-header"></div>
    `;

  const detailsItems = document.createElement("div");
  detailsItems.className = "details-container";

  detailsItems.innerHTML = `
      

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
    relatedItem.className = "movie-list-item swiper-slide";

    relatedItem.innerHTML = `
        <img class="movie-list-item-img" src="${relatedMovie.thumbnail}" alt="${
      relatedMovie.title
    }" />
    <div class="overlay"></div>
      <span class="movie-list-item-title">${relatedMovie.title}</span>
      <button class="movie-list-item-button" onclick="playMovie('${relatedMovie.slug
        .replace(/'/g, "\\'")
        .replace(/"/g, "&quot;")}')">
        <i class="fas fa-play-circle"></i>
      </button>
    `;

    // Add click event listener to the movie title to navigate to the corresponding page
    relatedItem
      .querySelector(".movie-list-item-title")
      .addEventListener("click", () => {
        window.location.href = `videoDetailsPage.html?title=${relatedMovie.slug}`;
      });

    relatedList.appendChild(relatedItem);
  });
}

function createEpisodeCards(EpisodeData) {
  const seasonList = document.querySelector(".episode-section");
  seasonList.innerHTML = "";

  EpisodeData.forEach((season) => {
    // Create a container for each season
    const seasonContainer = document.createElement("div");
    seasonContainer.className = "season-container";

    const seasonTitle = document.createElement("h2");
    seasonTitle.className = "episode-list-title";
    seasonTitle.textContent = season.name;

    const swiperContent = document.createElement("div");
    swiperContent.className = "swiper-container-episode"
    
    const swiper = document.createElement("div");
    swiper.className = "swiper"

    const episodeList = document.createElement("div");
    episodeList.className = "episode-list all-episode swiper-wrapper";

    const swiperPagination = document.createElement("div");
    swiperPagination.className = "swiper-pagination";

    const swiperNextButton = document.createElement("div");
    swiperNextButton.className = "swiper-button-next id";

    const swiperPrevButton = document.createElement("div");
    swiperPrevButton.className = "swiper-button-prev id";

    // Append the season title and episode list to the season container
    seasonList.appendChild(seasonTitle);
    swiperContent.appendChild(episodeList);
    swiperContent.appendChild(swiperPagination);
    swiperContent.appendChild(swiperNextButton);
    swiperContent.appendChild(swiperPrevButton);
    swiper.appendChild(swiperContent)
    seasonContainer.appendChild(swiper);

    // Iterate through each episode
    season.episodes.forEach((episode) => {
      const episodeItem = document.createElement("div");
      episodeItem.className = "movie-list-item swiper-slide";

      episodeItem.innerHTML = `
          <img class="movie-list-item-img" src="${episode.thumbnail}" alt="${
        episode.title
      }" />
      <div class="overlay"></div>
          <span class="movie-list-item-title">${episode.title}</span>
          <button class="movie-list-item-button" onclick="playMovie('${""
            .replace(/'/g, "\\'")
            .replace(/"/g, "&quot;")}')">
          <i class="fas fa-play-circle"></i>
          </button>
        `;

      // Add click event listener to the episode title to navigate to the corresponding page
      episodeItem
        .querySelector(".movie-list-item-title")
        .addEventListener("click", () => {
          window.location.href = `videoDetailsPage.html?title=${episode.slug}`;
        });

      // Append the episode item to the episode list
      episodeList.appendChild(episodeItem);
    });

    // Append the season container to the main season list
    seasonList.appendChild(seasonContainer);
  });
}


fetchMoviesDetails();
fetchSeriesDetails();
fetchRelatedVideos();
fetchRelatedSeries();
initializeAllSwipers();