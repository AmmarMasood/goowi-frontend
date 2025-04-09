import axiosInstance from "../libs/axios";

export const createProfile = async (data) => {
  try {
    await axiosInstance.post(`/profiles`, data);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const updateProfile = async (userId, data) => {
  try {
    await axiosInstance.put(`/profiles/${userId}`, data);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const getProfile = async () => {
  try {
    const { data } = await axiosInstance.get(`/profiles/me`);
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
};

export const getCharities = async () => {
  try {
    const { data } = await axiosInstance.get(`/profiles/all/charities`);
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
};

export const getUserMetrics = async (userId) => {
  try {
    const { data } = await axiosInstance.get(`/profiles/metrics/${userId}`);
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
};

export const getProfileBySlug = async (slug) => {
  try {
    const { data } = await axiosInstance.get(`/profiles/slug/${slug}`);
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
};
