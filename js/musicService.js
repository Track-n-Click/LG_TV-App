const ALBUMS_API_URL = "https://c-1y15z120-t12c.ayozat.com/api/random/albums";
const LATEST_SONGS_API_URL =
  "https://c-1y15z120-t12c.ayozat.com/api/latest/songs";
const MOST_PLAYED_SONGS_API_URL =
  "https://c-1y15z120-t12c.ayozat.com/api/most-played/songs";
const ALBUM_BY_ID_API_URL = "https://c-1y15z120-t12c.ayozat.com/api/album";

const SONG_BY_ID_API_URL = "https://c-1y15z120-t12c.ayozat.com/api/song";

export async function fetchAlbums() {
  try {
    const response = await fetch(ALBUMS_API_URL);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch albums: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    return data.randomAlbums;
  } catch (error) {
    console.error("Failed to fetch albums:", error);
    return [];
  }
}

export async function fetchLatestSongs() {
  try {
    const response = await fetch(LATEST_SONGS_API_URL);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch latest songs: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    return data.latestSongs;
  } catch (error) {
    console.error("Failed to fetch latest songs:", error);
    return [];
  }
}

export async function fetchMostPlayedSongs() {
  try {
    const response = await fetch(MOST_PLAYED_SONGS_API_URL);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch most played songs: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    return data.mostPlayedSongs;
  } catch (error) {
    console.error("Failed to fetch most played songs:", error);
    return [];
  }
}

export async function fetchAlbumById(id) {
  try {
    const response = await fetch(ALBUM_BY_ID_API_URL + "/" + id);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch album Details: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch Series Details:", error);
    return [];
  }
}

export async function fetchSongById(id) {
  try {
    const response = await fetch(SONG_BY_ID_API_URL + "/" + id);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch Song Details: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch Song Details:", error);
    return [];
  }
}
