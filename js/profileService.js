import axios from "https://cdn.skypack.dev/axios";

// Define the base API URL to make it easier to maintain
// const API_BASE_URL = "https://c-1y15z120-t12c.ayozat.com/api";
const API_BASE_URL = "https://dapi.ayozat.co.uk/api";

const config = {
  PROFILEDATA_API_URL: `${API_BASE_URL}/user`,
};

export async function fetchProfileData(userId) {
  try {
    const response = await axios({
      method: "GET",
      url: `${config.PROFILEDATA_API_URL}/${userId}/favorites?current_user_id=${userId}`,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return response.data.profile;
  } catch (error) {
    console.error("Failed to fetch profile data:", error);
    return [];
  }
}
