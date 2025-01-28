import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://ajs-server.hostdonor.com/api/v1";
const FILE_URL =
  process.env.NEXT_PUBLIC_FILE_URL || "https://ajs-files.hostdonor.com/api/v1";

interface JobSeeker {
  _id: string;
  userInfo: {
    email: string;
  };
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  introduction: string;
  profession: string;
  phone?: string;
  skills: string[];
  languages: string[];
  city: string;
  province: string;
  country: string;
  nationality?: string;
  postalCode?: string;
  openToOffers: boolean;
  education: any[];
  experience: any[];
  projects: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  profilePicture?: string;
  resume?: string;
  resumeUrl: string;
  resumeUploadDate: string;
  resumeFileSize: number;
  company: string;
  profileCompletion: number; // Add this line
}

interface Skill {
  _id: string;
  name: string;
  category: string;
  value: string;
}

interface Sector {
  _id: string;
  name: string;
  category: string;
  value: string;
}
interface Benefit {
  _id: string;
  name: string;
  category: string;
  value: string;
}

interface ProfileState {
  jobSeeker: JobSeeker | null;
  skills: Skill[];
  sectors: Sector[];
  benefits: Benefit[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProfileState = {
  jobSeeker: null,
  status: "idle",
  skills: [],
  benefits: [],
  sectors: [],
  error: null,
};
interface UpdateProfilePictureArgs {
  id: string;
  file: File;
  token: string;
}

// Function to get token and id from local storage
const getAuthData = () => {
  const token = localStorage.getItem("accessToken");
  const id = localStorage.getItem("_id");
  return { token, id };
};

// Thunk to fetch job seeker profile
export const fetchProfile = createAsyncThunk<
  JobSeeker,
  { id: string; token: string },
  { rejectValue: string }
>("profile/fetchProfile", async ({ id, token }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/job-seeker/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.jobSeeker;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message ||
          "An error occurred while fetching the profile."
      );
    } else {
      return rejectWithValue("An unknown error occurred");
    }
  }
});

// Thunk to update job seeker profile details
export const updateProfile = createAsyncThunk<
  JobSeeker,
  { id: string; updates: Partial<JobSeeker>; token: string },
  { rejectValue: string }
>(
  "profile/updateProfile",
  async ({ id, updates, token }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_URL}/job-seeker/${id}`,
        updates,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.jobSeeker;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message ||
            "An error occurred while updating the profile."
        );
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Thunk to update job seeker profile picture
export const updateProfilePicture = createAsyncThunk<
  JobSeeker,
  UpdateProfilePictureArgs,
  { rejectValue: string }
>(
  "profile/updateProfilePicture",
  async ({ id, file, token }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("profilePicture", file);

      const response = await axios.patch(
        `${FILE_URL}/files/job-seeker/profile-picture/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.jobSeeker;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to update profile picture."
        );
      } else {
        return rejectWithValue("An unknown error occurred.");
      }
    }
  }
);

// Thunk to toggle open to offers
export const toggleOpenToOffers = createAsyncThunk<
  JobSeeker,
  void,
  { rejectValue: string }
>("profile/toggleOpenToOffers", async (_, { rejectWithValue }) => {
  const { token, id } = getAuthData();
  if (!token || !id) return rejectWithValue("Missing authentication data");

  try {
    const response = await axios.patch(
      `${API_URL}/job-seeker/toggle-open-to-offers/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.jobSeeker;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message ||
          "An error occurred while toggling open to offers."
      );
    } else {
      return rejectWithValue("An unknown error occurred");
    }
  }
});

// Thunk to search job seekers
export const searchJobSeekers = createAsyncThunk<
  JobSeeker[],
  string,
  { rejectValue: string }
>("profile/searchJobSeekers", async (search, { rejectWithValue }) => {
  const { token } = getAuthData();
  if (!token) return rejectWithValue("Missing authentication data");

  try {
    const response = await axios.get(`${API_URL}/job-seekers/search`, {
      params: { search },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.jobSeekers;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message ||
          "An error occurred while searching job seekers."
      );
    } else {
      return rejectWithValue("An unknown error occurred");
    }
  }
});

// Thunk to add or update resume
export const addOrUpdateResume = createAsyncThunk<
  { resumeUrl: string },
  { id: string; file: File; token: string },
  { rejectValue: string }
>(
  "profile/addOrUpdateResume",
  async ({ id, file, token }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await axios.patch(
        `${FILE_URL}/files/job-seeker/resume/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Store the actual URL returned from the backend
      return { resumeUrl: response.data.resumeUrl };
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message ||
            "An error occurred while updating the resume."
        );
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

export const deleteResume = createAsyncThunk<
  { success: boolean },
  { filename: string; token: string },
  { rejectValue: string }
>("profile/deleteResume", async ({ filename, token }, { rejectWithValue }) => {
  try {
    if (!filename) {
      throw new Error("Filename is required");
    }

    // Ensure the filename is properly encoded
    const encodedFilename = encodeURIComponent(filename);

    const response = await axios.delete(
      `${API_URL}/job-seeker/resume?filename=${encodedFilename}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to delete resume");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting resume:", error);
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message ||
          "An error occurred while deleting the resume."
      );
    } else {
      return rejectWithValue("An unknown error occurred");
    }
  }
});

// Thunk to add education
export const addEducation = createAsyncThunk<
  JobSeeker,
  { education: any },
  { rejectValue: string }
>("profile/addEducation", async ({ education }, { rejectWithValue }) => {
  const { token, id } = getAuthData();
  if (!token || !id) return rejectWithValue("Missing authentication data");

  try {
    const response = await axios.post(
      `${API_URL}/job-seeker/education`,
      education,
      {
        params: { jobSeekerId: id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.jobSeeker;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message ||
          "An error occurred while adding education."
      );
    } else {
      return rejectWithValue("An unknown error occurred");
    }
  }
});

// Thunk to update education
export const updateEducation = createAsyncThunk<
  JobSeeker,
  { educationId: string; education: any },
  { rejectValue: string }
>(
  "profile/updateEducation",
  async ({ educationId, education }, { rejectWithValue }) => {
    const { token, id } = getAuthData();
    if (!token || !id) return rejectWithValue("Missing authentication data");

    try {
      const response = await axios.patch(
        `${API_URL}/job-seeker/education`,
        education,
        {
          params: { jobSeekerId: id, educationId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.jobSeeker;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message ||
            "An error occurred while updating education."
        );
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Thunk to delete education
export const deleteEducation = createAsyncThunk<
  JobSeeker,
  { educationId: string },
  { rejectValue: string }
>("profile/deleteEducation", async ({ educationId }, { rejectWithValue }) => {
  const { token, id } = getAuthData();
  if (!token || !id) return rejectWithValue("Missing authentication data");

  try {
    const response = await axios.delete(`${API_URL}/job-seeker/education`, {
      params: { jobSeekerId: id, educationId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.jobSeeker;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message ||
          "An error occurred while deleting education."
      );
    } else {
      return rejectWithValue("An unknown error occurred");
    }
  }
});

// Thunk to add experience
export const addExperience = createAsyncThunk<
  JobSeeker,
  { experience: any },
  { rejectValue: string }
>("profile/addExperience", async ({ experience }, { rejectWithValue }) => {
  const { token, id } = getAuthData();
  if (!token || !id) return rejectWithValue("Missing authentication data");

  try {
    const response = await axios.post(
      `${API_URL}/job-seeker/experience`,
      experience,
      {
        params: { jobSeekerId: id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.jobSeeker;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message ||
          "An error occurred while adding experience."
      );
    } else {
      return rejectWithValue("An unknown error occurred");
    }
  }
});

// Thunk to update experience
export const updateExperience = createAsyncThunk<
  JobSeeker,
  { experienceId: string; experience: any },
  { rejectValue: string }
>(
  "profile/updateExperience",
  async ({ experienceId, experience }, { rejectWithValue }) => {
    const { token, id } = getAuthData();
    if (!token || !id) return rejectWithValue("Missing authentication data");

    try {
      const response = await axios.patch(
        `${API_URL}/job-seeker/experience`,
        experience,
        {
          params: { jobSeekerId: id, experienceId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.jobSeeker;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message ||
            "An error occurred while updating experience."
        );
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Thunk to delete experience
export const deleteExperience = createAsyncThunk<
  JobSeeker,
  { experienceId: string },
  { rejectValue: string }
>("profile/deleteExperience", async ({ experienceId }, { rejectWithValue }) => {
  const { token, id } = getAuthData();
  if (!token || !id) return rejectWithValue("Missing authentication data");

  try {
    const response = await axios.delete(`${API_URL}/job-seeker/experience`, {
      params: { jobSeekerId: id, experienceId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.jobSeeker;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message ||
          "An error occurred while deleting experience."
      );
    } else {
      return rejectWithValue("An unknown error occurred");
    }
  }
});

// Thunk to add project
export const addProject = createAsyncThunk<
  JobSeeker,
  { project: any },
  { rejectValue: string }
>("profile/addProject", async ({ project }, { rejectWithValue }) => {
  const { token, id } = getAuthData();
  if (!token || !id) return rejectWithValue("Missing authentication data");

  try {
    const response = await axios.post(
      `${API_URL}/job-seeker/project`,
      project,
      {
        params: { jobSeekerId: id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.jobSeeker;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message || "An error occurred while adding project."
      );
    } else {
      return rejectWithValue("An unknown error occurred");
    }
  }
});

// Thunk to update project
export const updateProject = createAsyncThunk<
  JobSeeker,
  { projectId: string; project: any },
  { rejectValue: string }
>(
  "profile/updateProject",
  async ({ projectId, project }, { rejectWithValue }) => {
    const { token, id } = getAuthData();
    if (!token || !id) return rejectWithValue("Missing authentication data");

    try {
      const response = await axios.patch(
        `${API_URL}/job-seeker/project`,
        project,
        {
          params: { jobSeekerId: id, projectId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.jobSeeker;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message ||
            "An error occurred while updating project."
        );
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Thunk to delete project
export const deleteProject = createAsyncThunk<
  JobSeeker,
  { projectId: string },
  { rejectValue: string }
>("profile/deleteProject", async ({ projectId }, { rejectWithValue }) => {
  const { token, id } = getAuthData();
  if (!token || !id) return rejectWithValue("Missing authentication data");

  try {
    const response = await axios.delete(`${API_URL}/job-seeker/project`, {
      params: { jobSeekerId: id, projectId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.jobSeeker;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message ||
          "An error occurred while deleting project."
      );
    } else {
      return rejectWithValue("An unknown error occurred");
    }
  }
});

export const fetchSkills = createAsyncThunk<
  Skill[], // Define the expected response type
  void,
  { rejectValue: string }
>("profile/fetchSkills", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/app/skills`);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message ||
          "An error occurred while fetching skills."
      );
    } else {
      return rejectWithValue("An unknown error occurred");
    }
  }
});
export const fetchSectors = createAsyncThunk<
  Sector[], // Define the expected response type
  void,
  { rejectValue: string }
>("profile/fetchSectors", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/app/sectors`);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message ||
          "An error occurred while fetching skills."
      );
    } else {
      return rejectWithValue("An unknown error occurred");
    }
  }
});

export const fetchBenefits = createAsyncThunk<
  Benefit[], // Define the expected response type
  void,
  { rejectValue: string }
>("profile/fetchBenefit", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/app/benefits`);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message ||
          "An error occurred while fetching skills."
      );
    } else {
      return rejectWithValue("An unknown error occurred");
    }
  }
});

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchProfile.fulfilled,
        (state, action: PayloadAction<JobSeeker>) => {
          state.status = "succeeded";
          state.jobSeeker = action.payload;
          state.error = null;
        }
      )
      .addCase(
        fetchProfile.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "An unknown error occurred";
        }
      )
      .addCase(updateProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        updateProfile.fulfilled,
        (state, action: PayloadAction<JobSeeker>) => {
          state.status = "succeeded";
          state.jobSeeker = action.payload;
          state.error = null;
        }
      )
      .addCase(
        updateProfile.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "An unknown error occurred";
        }
      )
      .addCase(updateProfilePicture.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        updateProfilePicture.fulfilled,
        (state, action: PayloadAction<JobSeeker>) => {
          state.status = "succeeded";
          if (state.jobSeeker) {
            state.jobSeeker.profilePicture = action.payload.profilePicture;
          }
          state.error = null;
        }
      )
      .addCase(
        updateProfilePicture.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "An unknown error occurred";
        }
      )
      .addCase(toggleOpenToOffers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        toggleOpenToOffers.fulfilled,
        (state, action: PayloadAction<JobSeeker>) => {
          state.status = "succeeded";
          state.jobSeeker = action.payload;
          state.error = null;
        }
      )
      .addCase(
        toggleOpenToOffers.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "An unknown error occurred";
        }
      )
      .addCase(searchJobSeekers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        searchJobSeekers.fulfilled,
        (state, action: PayloadAction<JobSeeker[]>) => {
          state.status = "succeeded";
          state.jobSeeker = action.payload[0]; // Assuming you want the first result as the current job seeker
          state.error = null;
        }
      )
      .addCase(
        searchJobSeekers.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "An unknown error occurred";
        }
      )
      .addCase(
        addOrUpdateResume.fulfilled,
        (state, action: PayloadAction<{ resumeUrl: string }>) => {
          state.status = "succeeded";
          if (state.jobSeeker) {
            state.jobSeeker.resume = action.payload.resumeUrl;
          }
          state.error = null;
        }
      )
      .addCase(addOrUpdateResume.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addOrUpdateResume.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "An error occurred while updating the resume.";
      })
      .addCase(deleteResume.fulfilled, (state) => {
        state.status = "succeeded";
        if (state.jobSeeker) {
          state.jobSeeker.resume = undefined;
        }
        state.error = null;
      })
      .addCase(deleteResume.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteResume.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "An error occurred while deleting the resume.";
      })
      .addCase(addEducation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        addEducation.fulfilled,
        (state, action: PayloadAction<JobSeeker>) => {
          state.status = "succeeded";
          state.jobSeeker = action.payload;
          state.error = null;
        }
      )
      .addCase(
        addEducation.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "An unknown error occurred";
        }
      )
      .addCase(updateEducation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        updateEducation.fulfilled,
        (state, action: PayloadAction<JobSeeker>) => {
          state.status = "succeeded";
          state.jobSeeker = action.payload;
          state.error = null;
        }
      )
      .addCase(
        updateEducation.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "An unknown error occurred";
        }
      )
      .addCase(deleteEducation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        deleteEducation.fulfilled,
        (state, action: PayloadAction<JobSeeker>) => {
          state.status = "succeeded";
          state.jobSeeker = action.payload;
          state.error = null;
        }
      )
      .addCase(
        deleteEducation.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "An unknown error occurred";
        }
      )
      .addCase(addExperience.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        addExperience.fulfilled,
        (state, action: PayloadAction<JobSeeker>) => {
          state.status = "succeeded";
          state.jobSeeker = action.payload;
          state.error = null;
        }
      )
      .addCase(
        addExperience.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "An unknown error occurred";
        }
      )
      .addCase(updateExperience.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        updateExperience.fulfilled,
        (state, action: PayloadAction<JobSeeker>) => {
          state.status = "succeeded";
          state.jobSeeker = action.payload;
          state.error = null;
        }
      )
      .addCase(
        updateExperience.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "An unknown error occurred";
        }
      )
      .addCase(deleteExperience.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        deleteExperience.fulfilled,
        (state, action: PayloadAction<JobSeeker>) => {
          state.status = "succeeded";
          state.jobSeeker = action.payload;
          state.error = null;
        }
      )
      .addCase(
        deleteExperience.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "An unknown error occurred";
        }
      )
      .addCase(addProject.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        addProject.fulfilled,
        (state, action: PayloadAction<JobSeeker>) => {
          state.status = "succeeded";
          state.jobSeeker = action.payload;
          state.error = null;
        }
      )
      .addCase(
        addProject.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "An unknown error occurred";
        }
      )
      .addCase(updateProject.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        updateProject.fulfilled,
        (state, action: PayloadAction<JobSeeker>) => {
          state.status = "succeeded";
          state.jobSeeker = action.payload;
          state.error = null;
        }
      )
      .addCase(
        updateProject.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "An unknown error occurred";
        }
      )
      .addCase(deleteProject.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        deleteProject.fulfilled,
        (state, action: PayloadAction<JobSeeker>) => {
          state.status = "succeeded";
          state.jobSeeker = action.payload;
          state.error = null;
        }
      )
      .addCase(
        deleteProject.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "An unknown error occurred";
        }
      )
      .addCase(fetchSkills.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchSkills.fulfilled,
        (state, action: PayloadAction<Skill[]>) => {
          state.status = "succeeded";
          state.skills = action.payload;
          state.error = null;
        }
      )
      .addCase(
        fetchSkills.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "An unknown error occurred";
        }
      )
      .addCase(fetchSectors.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchSectors.fulfilled,
        (state, action: PayloadAction<Sector[]>) => {
          state.status = "succeeded";
          state.sectors = action.payload;
          state.error = null;
        }
      )
      .addCase(
        fetchSectors.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "An unknown error occurred";
        }
      )
      .addCase(fetchBenefits.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchBenefits.fulfilled,
        (state, action: PayloadAction<Benefit[]>) => {
          state.status = "succeeded";
          state.benefits = action.payload;
          state.error = null;
        }
      )
      .addCase(
        fetchBenefits.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "An unknown error occurred";
        }
      );
  },
});

export default profileSlice.reducer;
export type { JobSeeker, Skill };
