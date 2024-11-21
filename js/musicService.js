import axios from "https://cdn.skypack.dev/axios";

// config.js
// const API_BASE_URL = "https://c-1y15z120-t12c.ayozat.com/api";
const API_BASE_URL = "https://dapi.ayozat.co.uk/api";

const config = {
  ALBUMS_API_URL: `${API_BASE_URL}/random/albums`,
  LATEST_SONGS_API_URL: `${API_BASE_URL}/latest/songs`,
  MOST_PLAYED_SONGS_API_URL: `${API_BASE_URL}/most-played/songs`,
  ALBUM_BY_ID_API_URL: `${API_BASE_URL}/album`,
  SONG_BY_ID_API_URL: `${API_BASE_URL}/song`,
};

export async function fetchAlbums() {
  try {
    const response = await axios({
      method: "GET",
      url: config.ALBUMS_API_URL,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return response.data.randomAlbums;
  } catch (error) {
    console.error("Failed to fetch albums:", error);
    return [];
  }
}

export async function fetchLatestSongs() {
  try {
    const response = await axios({
      method: "GET",
      url: config.LATEST_SONGS_API_URL,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return response.data.latestSongs;
  } catch (error) {
    console.error("Failed to fetch latest songs:", error);
    return [];
  }
}

export async function fetchMostPlayedSongs() {
  try {
    const response = await axios({
      method: "GET",
      url: config.MOST_PLAYED_SONGS_API_URL,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return response.data.mostPlayedSongs;
  } catch (error) {
    console.error("Failed to fetch most played songs:", error);
    return [];
  }
}

export async function fetchAlbumById(id) {
  try {
    const response = await axios({
      method: "GET",
      url: `${config.ALBUM_BY_ID_API_URL}/${id}`,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch album details:", error);
    return [];
  }
}

export async function fetchSongById(id) {
  try {
    const response = await axios({
      method: "GET",
      url: `${config.SONG_BY_ID_API_URL}/${id}`,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch song details:", error);
    return [];
  }
}
