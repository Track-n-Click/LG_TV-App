import axios from "https://cdn.skypack.dev/axios";

// Define the base API URL to make it easier to maintain
// const API_BASE_URL = "https://c-1y15z120-t12c.ayozat.com/api";
const API_BASE_URL = "https://dapi.ayozat.co.uk/api";

const config = {
  MOVIES_API_URL: `${API_BASE_URL}/movies/random`,
  TV_SERIES_API_URL: `${API_BASE_URL}/tv-series/random`,
  TV_CHANNELS_API_URL: `${API_BASE_URL}/tv-channels/featured`,
  SLIDERS_API_URL: `${API_BASE_URL}/home/slider`,
  VIDEO_DETAILS_BY_SLUG_API_URL: `${API_BASE_URL}/movies`,
  SERIES_DETAILS_BY_SLUG_API_URL: `${API_BASE_URL}/tv-series`,
  SERIES_DETAILS_BY_STREAM_KEY_API_URL: `${API_BASE_URL}/tv-series/episodes`,
  VIDEO_SLIDERS_API_URL: `${API_BASE_URL}/video/slider`,
};

export async function fetchSliders() {
  try {
    const response = await axios({
      method: "GET",
      url: config.SLIDERS_API_URL,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch sliders:", error);
    return [];
  }
}

export async function fetchMovies() {
  try {
    const response = await axios({
      method: "GET",
      url: config.MOVIES_API_URL,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch movies:", error);
    return [];
  }
}

export async function fetchTVSeries() {
  try {
    const response = await axios({
      method: "GET",
      url: config.TV_SERIES_API_URL,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch TV series:", error);
    return [];
  }
}

export async function fetchTVChannels() {
  try {
    const response = await axios({
      method: "GET",
      url: config.TV_CHANNELS_API_URL,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch TV channels:", error);
    return [];
  }
}

export async function fetchVideoDetailsBySlug(slug) {
  try {
    const response = await axios({
      method: "GET",
      url: `${config.VIDEO_DETAILS_BY_SLUG_API_URL}/${slug}`,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch Movie Details:", error);
    return [];
  }
}

export async function fetchSeriesDetailsBySlug(slug) {
  try {
    const response = await axios({
      method: "GET",
      url: `${config.SERIES_DETAILS_BY_SLUG_API_URL}/${slug}`,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch Series Details:", error);
    return [];
  }
}

export async function fetchSeriesDetailsByStreamKey(streamKey) {
  try {
    const response = await axios({
      method: "GET",
      url: `${config.SERIES_DETAILS_BY_STREAM_KEY_API_URL}/${streamKey}`,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch Series Details:", error);
    return [];
  }
}

export async function fetchVideosSliders() {
  try {
    const response = await axios({
      method: "GET",
      url: config.VIDEO_SLIDERS_API_URL,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    const data = response.data;
    const combinedData = [...data.movies, ...data.tv_series];
    return combinedData;
  } catch (error) {
    console.error("Failed to fetch sliders:", error);
    return [];
  }
}
