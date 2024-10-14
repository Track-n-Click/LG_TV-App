import axios from "https://cdn.skypack.dev/axios";

const MOVIES_API_URL = "https://c-1y15z120-t12c.ayozat.com/api/movies/random";
const TV_SERIES_API_URL =
  "https://c-1y15z120-t12c.ayozat.com/api/tv-series/random";
const TV_CHANNELS_API_URL =
  "https://c-1y15z120-t12c.ayozat.com/api/tv-channels/featured";

const SLIDERS_API_URL = "https://c-1y15z120-t12c.ayozat.com/api/home/slider";
const VIDEO_DETAILS_BY_SLUG_API_URL =
  "https://c-1y15z120-t12c.ayozat.com/api/movies";

const SERIES_DETAILS_BY_SLUG_API_URL =
  "https://c-1y15z120-t12c.ayozat.com/api/tv-series";

const SERIES_DETAILS_BY_STREAM_KEY_API_URL =
  "https://c-1y15z120-t12c.ayozat.com/api/tv-series/episodes";

const VIDEO_SLIDERS_API_URL =
  "https://c-1y15z120-t12c.ayozat.com/api/video/slider";

export async function fetchSliders() {
  try {
    const response = await axios({
      method: "GET",
      url: SLIDERS_API_URL,
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
      url: MOVIES_API_URL,
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
      url: TV_SERIES_API_URL,
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
      url: TV_CHANNELS_API_URL,
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
      url: `${VIDEO_DETAILS_BY_SLUG_API_URL}/${slug}`,
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
      url: `${SERIES_DETAILS_BY_SLUG_API_URL}/${slug}`,
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
      url: `${SERIES_DETAILS_BY_STREAM_KEY_API_URL}/${streamKey}`,
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
      url: VIDEO_SLIDERS_API_URL,
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
