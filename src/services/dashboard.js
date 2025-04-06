import axiosInstance from "../libs/axios";

export const getWaves = async (
  hashtags = [],
  title = "",
  page = 1,
  limit = 10
) => {
  try {
    // Construct the query parameters
    const params = {
      page,
      limit,
    };

    if (hashtags.length > 0) {
      params.hashtags = hashtags; // Add hashtags to the query
    }

    if (title) {
      params.title = title; // Add title to the query
    }

    // Make the API call
    const response = await axiosInstance.get("/waves/all/filter", { params });

    // Return the response data
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error fetching waves:", error);

    return {
      success: false,
      error: error.response?.data?.message || "An error occurred",
    };
  }
};
