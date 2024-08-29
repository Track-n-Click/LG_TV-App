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

export async function fetchSliders() {
  try {
    const response = await fetch(SLIDERS_API_URL);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch sliders: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch sliders:", error);
    return [];
  }
}

export async function fetchMovies() {
  try {
    const response = await fetch(MOVIES_API_URL);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch movies: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch movies:", error);
    return [];
  }
}

export async function fetchTVSeries() {
  try {
    const response = await fetch(TV_SERIES_API_URL);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch TV series: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch TV series:", error);
    return [];
  }
}

export async function fetchTVChannels() {
  try {
    const response = await fetch(TV_CHANNELS_API_URL);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch TV channels: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch TV channels:", error);
    return [];
  }
}

export async function fetchVideoDetailsBySlug(slug) {
  try {
    const response = await fetch(VIDEO_DETAILS_BY_SLUG_API_URL + "/" + slug);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch Movie Details: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch Movie Details:", error);
    return [];
  }
}

export async function fetchSeriesDetailsBySlug(slug) {
  try {
    const response = await fetch(SERIES_DETAILS_BY_SLUG_API_URL + "/" + slug);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch Series Details: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch Series Details:", error);
    return [];
  }
}
