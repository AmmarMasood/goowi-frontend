import axiosInstance from "../libs/axios";

export const verifyEmail = async (token) => {
  try {
    await axiosInstance.get(`/auth/verify-email?token=${token}`);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};
