import axios from "https://cdn.skypack.dev/axios";

// config.js
// const API_BASE_URL = "https://c-1y15z120-t12c.ayozat.com/api";
const API_BASE_URL = "https://dapi.ayozat.co.uk/api";

const config = {
  LATEST_PODCASTS_API_URL: `${API_BASE_URL}/latest-podscasts`,
  ALL_PODCASTS_API_URL: `${API_BASE_URL}/all-spodcasts?page=1`,
  PODCAST_BY_ID_API_URL: `${API_BASE_URL}/podcast`,
};

export async function fetchLatestPodcasts() {
  try {
    const response = await axios({
      method: "GET",
      url: config.LATEST_PODCASTS_API_URL,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    // console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch albums:", error);
    return [];
  }
}

export async function fetchAllPodcast() {
  try {
    const response = await axios({
      method: "GET",
      url: config.ALL_PODCASTS_API_URL,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    // console.log(response.data.data.data);
    return response.data.data.data;
  } catch (error) {
    console.error("Failed to fetch latest songs:", error);
    return [];
  }
}

export async function fetchPodcastById(id) {
  try {
    const response = await axios({
      method: "GET",
      url: `${config.PODCAST_BY_ID_API_URL}/${id}`,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch song details:", error);
    return [];
  }
}
