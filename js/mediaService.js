const MOVIES_API_URL = "https://c-1y15z120-t12c.ayozat.com/api/movies/random";
const TV_SERIES_API_URL = "https://c-1y15z120-t12c.ayozat.com/api/tv-series/random";
const TV_CHANNELS_API_URL = "https://c-1y15z120-t12c.ayozat.com/api/tv-channels/featured";

export async function fetchMovies() {
    try {
        const response = await fetch(MOVIES_API_URL);
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
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Failed to fetch TV channels:", error);
        return [];
    }
}
