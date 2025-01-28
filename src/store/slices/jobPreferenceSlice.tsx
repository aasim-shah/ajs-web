import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../index';

// Define interfaces for JobPreference and Sector
interface JobPreference {
  sectors: string[];
  salary?: {
    from: number;
    to?: number;
  };
  availability?: string;
  careerLevel?: string;
  jobType?: string;
  candidateType?: string;
  locations: {
    city?: string;
    province?: string;
    country?: string;
  }[];
}

interface Sector {
  _id: string;
  name: string;
  category: string;
  value: string;
}

interface JobPreferenceState {
  preferences: JobPreference | null;
  sectors: Sector[];
  selectedFilters: string[]; // New property
  salaryRange: { from: number; to: number } | null; // New property
  availability: string | null; // New property
  careerLevel: string | null; // New property
  jobType: string | null; // New property
  candidateType: string | null; // New property
  location: { country: string; state: string; city: string } | null; // New property
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL
const getAuthToken = () => localStorage.getItem('accessToken');

// Async thunk to fetch best matched jobs
export const fetchBestMatchedJobs = createAsyncThunk(
  'jobs/fetchBestMatchedJobs',
  async (jobSeekerId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { selectedFilters, salaryRange, availability, careerLevel, jobType, candidateType, location } = state.jobPreferences;
      const token = getAuthToken();

      const filterParams = {
        filters: selectedFilters,
        salaryFrom: salaryRange?.from,
        salaryTo: salaryRange?.to,
        availability,
        careerLevel,
        jobType,
        candidateType,
        country: location?.country,
        state: location?.state,
        city: location?.city,
      };

      const response = await axios.get(`${API_URL}/jobs/best-matched/${jobSeekerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: filterParams, // Pass filter parameters as query parameters
      });

      return response.data; // Assuming the API returns the data in the format you need
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Axios-specific error handling
        return rejectWithValue(error.response?.data.message || 'Failed to fetch jobs');
      }
      if (error instanceof Error) {
        // General error handling for non-Axios errors
        return rejectWithValue(error.message || 'An unknown error occurred');
      }
      // Return a generic message if error is not recognized
      return rejectWithValue('An unknown error occurred');
    }
  }
);


// Async thunk to fetch job preferences
export const fetchJobPreferences = createAsyncThunk<JobPreference[], void>(
  'jobPreferences/fetchJobPreferences',
  async (_, { rejectWithValue }) => {
    const token = getAuthToken();
    if (!token) return rejectWithValue('Access token is missing');

    try {
      const response = await axios.get(`${API_URL}/job-preferences`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch job preferences.');
      }
      return rejectWithValue('Failed to fetch job preferences.');
    }
  }
);

// Async thunk to fetch sectors
export const fetchSectors = createAsyncThunk<Sector[], void>(
  'jobPreferences/fetchSectors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/app/sectors`);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch sectors.');
      }
      return rejectWithValue('Failed to fetch sectors.');
    }
  }
);

// Async thunks for adding, updating, and deleting job preferences
export const addJobPreference = createAsyncThunk<JobPreference, JobPreference>(
  'jobPreferences/addJobPreference',
  async (preferenceData, { rejectWithValue }) => {
    const token = getAuthToken();
    if (!token) return rejectWithValue('Access token is missing');

    try {
      const response = await axios.post(`${API_URL}/job-preference`, preferenceData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to add job preference.');
      }
      return rejectWithValue('Failed to add job preference.');
    }
  }
);

export const updateJobPreference = createAsyncThunk<JobPreference, Partial<JobPreference>>(
  'jobPreferences/updateJobPreference',
  async (preferenceData, { rejectWithValue }) => {
    const token = getAuthToken();
    if (!token) return rejectWithValue('Access token is missing');

    try {
      const response = await axios.patch(`${API_URL}/job-preference`, preferenceData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data.message || 'Failed to update job preference.');
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message || 'An unknown error occurred');
      }
      return rejectWithValue('Failed to update job preference.');
    }
  }
);


export const deleteJobPreference = createAsyncThunk<void, void>(
  'jobPreferences/deleteJobPreference',
  async (_, { rejectWithValue }) => {
    const token = getAuthToken();
    if (!token) return rejectWithValue('Access token is missing');

    try {
      await axios.delete(`${API_URL}/job-preference`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to delete job preference.');
      }
      return rejectWithValue('Failed to delete job preference.');
    }
  }
);

// Initial state
const initialState: JobPreferenceState = {
  preferences: null,
  sectors: [],
  selectedFilters: [],
  salaryRange: null,
  availability: null,
  careerLevel: null,
  jobType: null,
  candidateType: null,
  location: null,
  status: 'idle',
  error: null,
};

// Create slice
const jobPreferenceSlice = createSlice({
  name: 'jobPreferences',
  initialState,
  reducers: {
    setSelectedFilters(state, action: PayloadAction<string[]>) {
      state.selectedFilters = action.payload;
    },
    setSalaryRange(state, action: PayloadAction<{ from: number; to: number } | null>) {
      state.salaryRange = action.payload;
    },
    setAvailability(state, action: PayloadAction<string | null>) {
      state.availability = action.payload;
    },
    setCareerLevel(state, action: PayloadAction<string | null>) {
      state.careerLevel = action.payload;
    },
    setJobType(state, action: PayloadAction<string | null>) {
      state.jobType = action.payload;
    },
    setCandidateType(state, action: PayloadAction<string | null>) {
      state.candidateType = action.payload;
    },
    setLocation(state, action: PayloadAction<{ country: string; state: string; city: string } | null>) {
      state.location = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobPreferences.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchJobPreferences.fulfilled, (state, action: PayloadAction<JobPreference[]>) => {
        const preference = action.payload[0] || null;
        state.preferences = preference ? {
          ...preference,
          sectors: preference.sectors || [],
          locations: preference.locations || []
        } : null;
        state.status = 'succeeded';
      })
      .addCase(fetchJobPreferences.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(addJobPreference.fulfilled, (state, action: PayloadAction<JobPreference>) => {
        state.preferences = action.payload;
        state.status = 'succeeded';
      })
      .addCase(updateJobPreference.fulfilled, (state, action: PayloadAction<JobPreference>) => {
        state.preferences = action.payload;
        state.status = 'succeeded';
      })
      .addCase(deleteJobPreference.fulfilled, (state) => {
        state.preferences = null;
        state.status = 'succeeded';
      })
      .addCase(deleteJobPreference.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchSectors.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSectors.fulfilled, (state, action: PayloadAction<Sector[]>) => {
        state.sectors = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchSectors.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedFilters,
  setSalaryRange,
  setAvailability,
  setCareerLevel,
  setJobType,
  setCandidateType,
  setLocation,
} = jobPreferenceSlice.actions;

export default jobPreferenceSlice.reducer;
