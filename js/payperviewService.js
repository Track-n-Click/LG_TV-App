import axios from "https://cdn.skypack.dev/axios@1.7.7";

// Define the base API URL to make it easier to maintain
// const API_BASE_URL = "https://c-1y15z120-t12c.ayozat.com/api";
const API_BASE_URL = "https://dapi.ayozat.co.uk/api";

const config = {
  ALL_PPV_API_URL: `${API_BASE_URL}/ppv-events/all`,
  PPV_DETAILS_BY_SLUG_API_URL: `${API_BASE_URL}/ppv-events/show`,
  PPV_PURCHASED_EVENT_API_URL: `${API_BASE_URL}/users/purchased/events`,
};

// Function to generate authorization headers
function authHeader() {
  // Retrieve the user object from localStorage
  const user = localStorage.getItem("userData"); // Assume "user" is the key storing the user object

  if (user) {
    const userData = JSON.parse(user); // Parse the JSON string
    if (userData.access_token) {
      // Check if the token exists
      return { Authorization: "Bearer " + userData.access_token }; // Return the header with the token
    }
  }

  return { Authorization: "" };
}

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

// Function to fetch purchased events for a user
export async function fetchPurchasedEvent(userId) {
  try {
    const headers = {
      "Content-Type": "application/json; charset=utf-8",
      ...authHeader(),
    };

    console.log("headers", headers);

    const response = await axios({
      method: "GET",
      url: `${config.PPV_PURCHASED_EVENT_API_URL}/${userId}`,
      headers: headers,
    });

    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch purchased events:", error.response || error);
    return [];
  }
}
