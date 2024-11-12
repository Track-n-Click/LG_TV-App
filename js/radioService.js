import axios from "https://cdn.skypack.dev/axios";

// config.js
// const API_BASE_URL = "https://c-1y15z120-t12c.ayozat.com/api";
const API_BASE_URL = "https://dapi.ayozat.co.uk/api";

const config = {
  RANDOM_STATIONS_API_URL: `${API_BASE_URL}/random/radio-stations`,
  MOST_TUNED_STATIONS_API_URL: `${API_BASE_URL}/most-tuned/radio-stations`
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
    return response.data.mostTunedRadioStations;
  } catch (error) {
    console.error("Failed to fetch latest songs:", error);
    return [];
  }
}