import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://ajs-server.hostdonor.com/api/v1";

interface Pagination {
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
}

interface JobState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  jobs: any[];
  countries: any[];
  pagination: Pagination | null;
}

interface CountryData {
  _id: string;
  city: string;
  province: string;
  country: string;
  location: string;
}

const initialState: JobState = {
  status: "idle",
  error: null,
  jobs: [],
  countries: [],
  pagination: null,
};

interface ApiFormData {
  title: string;
  sector: string;
  skills: string[];
  benefits: string[];
  salary: {
    from: number;
    to: number;
  };
  availability: string;
  careerLevel: string;
  jobType: string;
  candidateType: string;
  city: string;
  province: string;
  country: string;
  description: string;
}

interface UpdateJobPayload {
  id: string;
  jobData: ApiFormData;
}

const getAccessToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

export const postJob = createAsyncThunk(
  "jobs/postJob",
  async (jobData: ApiFormData, { rejectWithValue }) => {
    const token = getAccessToken();
    if (!token) {
      return rejectWithValue("No authorization token found");
    }
    try {
      const response = await axios.post(`${API_URL}/jobs`, jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message ||
            "An error occurred while posting the job."
        );
      } else if (error instanceof Error) {
        return rejectWithValue(error.message || "An unknown error occurred");
      }
    }
  }
);

export const getJobsByCompany = createAsyncThunk(
  "jobs/getJobsByCompany",
  async (
    { companyId, page }: { companyId: string; page: number },
    { rejectWithValue }
  ) => {
    const token = getAccessToken();
    if (!token) {
      return rejectWithValue("No authorization token found");
    }
    try {
      const response = await axios.get(
        `${API_URL}/jobs/company/${companyId}?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message ||
            "An error occurred while fetching the jobs."
        );
      } else if (error instanceof Error) {
        return rejectWithValue(error.message || "An unknown error occurred");
      }
    }
  }
);

export const getJobById = createAsyncThunk(
  "jobs/getJobById",
  async (jobId: string, { rejectWithValue }) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return rejectWithValue("No authorization token found");
    }
    try {
      const response = await axios.get(`${API_URL}/job/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.data) {
        return rejectWithValue("No data found");
      }
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message ||
            "An error occurred while fetching the job."
        );
      } else if (error instanceof Error) {
        return rejectWithValue(error.message || "An unknown error occurred");
      }
    }
  }
);

export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async ({ id, jobData }: UpdateJobPayload, { rejectWithValue }) => {
    const token = getAccessToken();
    if (!token) {
      return rejectWithValue("No authorization token found");
    }
    try {
      const response = await axios.put(`${API_URL}/job/${id}`, jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message ||
            "An error occurred while updating the job."
        );
      } else if (error instanceof Error) {
        return rejectWithValue(error.message || "An unknown error occurred");
      }
    }
  }
);

export const toggleJobActiveStatus = createAsyncThunk(
  "jobs/toggleActiveStatus",
  async (id: string, { rejectWithValue }) => {
    const token = getAccessToken(); // Ensure you have a function that retrieves the token
    if (!token) {
      return rejectWithValue("No authorization token found");
    }
    try {
      const response = await axios.patch(
        // `http://192.168.18.122:3333/api/v1/jobs/toggle-job-active-status/${id}`,
        `${API_URL}/jobs/toggle-job-active-status/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message ||
            "An error occurred while toggling the job active status."
        );
      } else if (error instanceof Error) {
        return rejectWithValue(error.message || "An unknown error occurred");
      }
    }
  }
);

export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (jobId: string, { rejectWithValue }) => {
    const token = getAccessToken();
    if (!token) {
      return rejectWithValue("No authorization token found");
    }
    try {
      const response = await axios.delete(`${API_URL}/job/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message ||
            "An error occurred while deleting the job."
        );
      } else if (error instanceof Error) {
        return rejectWithValue(error.message || "An unknown error occurred");
      }
    }
  }
);

/// fetch countries / states and cities
export const fetchCountriesData = createAsyncThunk<
  CountryData[],
  void,
  { rejectValue: string }
>("profile/fetchCountries", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/app/locations`);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message ||
          "An error occurred while fetching countries data."
      );
    } else {
      return rejectWithValue("An unknown error occurred");
    }
  }
});

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postJob.pending, (state) => {
        state.status = "loading";
      })
      .addCase(postJob.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(postJob.rejected, (state, action: PayloadAction<any>) => {
        state.status = "failed";
        state.error = action.payload || "An unknown error occurred";
      })
      .addCase(getJobsByCompany.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getJobsByCompany.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.status = "succeeded";
          state.jobs = action.payload.jobs;
          state.pagination = action.payload.pagination;
          state.error = null;
        }
      )
      .addCase(
        getJobsByCompany.rejected,
        (state, action: PayloadAction<any>) => {
          state.status = "failed";
          state.error = action.payload || "An unknown error occurred";
        }
      )
      .addCase(getJobById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getJobById.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(getJobById.rejected, (state, action: PayloadAction<any>) => {
        state.status = "failed";
        state.error = action.payload || "An unknown error occurred";
      })
      .addCase(updateJob.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateJob.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(updateJob.rejected, (state, action: PayloadAction<any>) => {
        state.status = "failed";
        state.error = action.payload || "An unknown error occurred";
      })
      .addCase(deleteJob.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteJob.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(deleteJob.rejected, (state, action: PayloadAction<any>) => {
        state.status = "failed";
        state.error = action.payload || "An unknown error occurred";
      })

      // fetch countries / states and cities
      .addCase(fetchCountriesData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchCountriesData.fulfilled,
        (state, action: PayloadAction<CountryData[]>) => {
          state.status = "succeeded";
          state.countries = action.payload;
          state.error = null;
        }
      )
      .addCase(
        fetchCountriesData.rejected,
        (state, action: PayloadAction<any>) => {
          state.status = "failed";
          state.error = action.payload || "An unknown error occurred";
        }
      );
  },
});

export default jobSlice.reducer;
