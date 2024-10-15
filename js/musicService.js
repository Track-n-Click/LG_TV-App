import axios from "https://cdn.skypack.dev/axios";

const ALBUMS_API_URL = "https://c-1y15z120-t12c.ayozat.com/api/random/albums";
const LATEST_SONGS_API_URL =
  "https://c-1y15z120-t12c.ayozat.com/api/latest/songs";
const MOST_PLAYED_SONGS_API_URL =
  "https://c-1y15z120-t12c.ayozat.com/api/most-played/songs";
const ALBUM_BY_ID_API_URL = "https://c-1y15z120-t12c.ayozat.com/api/album";

const SONG_BY_ID_API_URL = "https://c-1y15z120-t12c.ayozat.com/api/song";

export async function fetchAlbums() {
  try {
    const response = await axios({
      method: "GET",
      url: ALBUMS_API_URL,
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
      url: LATEST_SONGS_API_URL,
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
      url: MOST_PLAYED_SONGS_API_URL,
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
      url: `${ALBUM_BY_ID_API_URL}/${id}`,
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
      url: `${SONG_BY_ID_API_URL}/${id}`,
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
