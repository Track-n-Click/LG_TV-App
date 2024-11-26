import axios from "https://cdn.skypack.dev/axios@1.7.7";

// config.js
// const API_BASE_URL = "https://c-1y15z120-t12c.ayozat.com/api";
const API_BASE_URL = "https://dapi.ayozat.co.uk/api";

const config = {
  RANDOM_STATIONS_API_URL: `${API_BASE_URL}/random/radio-stations`,
  MOST_TUNED_STATIONS_API_URL: `${API_BASE_URL}/most-tuned/radio-stations`,
  SONG_BY_ID_API_URL: `${API_BASE_URL}/radio-stations/show`,
};

export async function fetchRandomStations() {
  try {
    const response = await axios({
      method: "GET",
      url: config.RANDOM_STATIONS_API_URL,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    console.log(response.data.randomRadioStations);
    return response.data.randomRadioStations;
  } catch (error) {
    console.error("Failed to fetch albums:", error);
    return [];
  }
}

export async function fetchMostTunedStations() {
  try {
    const response = await axios({
      method: "GET",
      url: config.MOST_TUNED_STATIONS_API_URL,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    console.log(response.data.mostTunedRadioStations);
    return response.data.mostTunedRadioStations;
  } catch (error) {
    console.error("Failed to fetch latest songs:", error);
    return [];
  }
}

export async function fetchRadioBySlug(slug) {
  try {
    const response = await axios({
      method: "GET",
      url: `${config.SONG_BY_ID_API_URL}/${slug}`,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    // console.log(response.data)
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch song details:", error);
    return [];
  }
}
