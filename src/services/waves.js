import axiosInstance from "../libs/axios";

export const createWave = async (data) => {
  try {
    await axiosInstance.post(`/waves`, data);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const updateWave = async (data) => {
  try {
    await axiosInstance.patch(`/waves/${data._id}`, data);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const getCurrentUserWaves = async (creatorId) => {
  try {
    const { data } = await axiosInstance.get(`/waves/creator/${creatorId}`);
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
};

export const deleteWave = async (waveId) => {
  try {
    await axiosInstance.delete(`/waves/${waveId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const approveOrRejectWave = async (waveId, status) => {
  try {
    await axiosInstance.patch(`/waves/${waveId}/charity-approval`, { status });
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const getByCharityId = async (charityId) => {
  try {
    const { data } = await axiosInstance.get(`/waves/charity/${charityId}`);
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
};

export const getAllHashTags = async () => {
  try {
    const { data } = await axiosInstance.get(`/waves/all/hashtags`);
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
};

export const participateInWave = async (waveId) => {
  try {
    const { data } = await axiosInstance.post(
      `/waves/part/${waveId}/participants`
    );
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
};

export const getWavesByParticipantId = async () => {
  try {
    const { data } = await axiosInstance.get(`/waves/participant/part/users`);
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
};

export const getWavesByParticipantWithId = async (userId) => {
  try {
    const { data } = await axiosInstance.get(
      `/waves/participant/part/users/${userId}`
    );
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
};
