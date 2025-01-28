import { axiosInstance } from "./AxiosInstance";

export const getSavedJobs = async (jobSeekerId: string, page: number) => {
  try {
    const response = await axiosInstance.get(
      `/jobs/saved-jobs/${jobSeekerId}?page=${page}`,
      {
        headers: { requiresAuth: true },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
