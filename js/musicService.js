const ALBUMS_API_URL = "https://c-1y15z120-t12c.ayozat.com/api/random/albums";
const LATEST_SONGS_API_URL = "https://c-1y15z120-t12c.ayozat.com/api/latest/songs";
const MOST_PLAYED_SONGS_API_URL = "https://c-1y15z120-t12c.ayozat.com/api/most-played/songs";

export async function fetchAlbums() {
    try {
        const response = await fetch(ALBUMS_API_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch albums: ${response.status} ${response.statusText}`);
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
            throw new Error(`Failed to fetch latest songs: ${response.status} ${response.statusText}`);
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
            throw new Error(`Failed to fetch most played songs: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data.mostPlayedSongs;
    } catch (error) {
        console.error("Failed to fetch most played songs:", error);
        return [];
    }
}