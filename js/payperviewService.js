import axios from "https://cdn.skypack.dev/axios";

// Define the base API URL to make it easier to maintain
// const API_BASE_URL = "https://c-1y15z120-t12c.ayozat.com/api";
const API_BASE_URL = "https://dapi.ayozat.co.uk/api";

const config = {
  ALL_PPV_API_URL: `${API_BASE_URL}/ppv-events/all`,
  PPV_DETAILS_BY_SLUG_API_URL: `${API_BASE_URL}/ppv-events/show`,
};

export async function fetchAllPayperview() {
  try {
    const response = await axios({
      method: "GET",
      url: config.ALL_PPV_API_URL,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch upcoming ppv:", error);
    return [];
  }
}

export async function fetchPPVDetailsBySlug(slug) {
  try {
    const response = await axios({
      method: "GET",
      url: `${config.PPV_DETAILS_BY_SLUG_API_URL}/${slug}`,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch ppv Details:", error);
    return [];
  }
}
