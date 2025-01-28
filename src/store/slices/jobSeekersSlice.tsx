import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Job {
  _id: string;
  title: string;
  company: string;
  // Add other job details as needed
}

interface JobSeeker {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  savedJobs: Job[];
  profilePicture?: string; 
  // Add other job seeker details as needed
}

interface JobSeekerState {
  jobSeeker: JobSeeker | null;
  loading: boolean;
  error: string | null;
}

const initialState: JobSeekerState = {
  jobSeeker: null,
  loading: false,
  error: null,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL



const getAuthToken = () => {
  const token = localStorage.getItem('accessToken');
  
  return token;
};


export const getJobSeekerById = createAsyncThunk<JobSeeker, string, { rejectValue: string }>(
  'jobSeeker/getJobSeekerById',
  async (jobSeekerId, { rejectWithValue }) => {
    const token = getAuthToken();
    if (!token) {
      return rejectWithValue('Access token is missing');
    }

    try {
      const response = await axios.get(`${API_URL}/job-seeker/${jobSeekerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
     
      return response.data.jobSeeker;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('API Error:', error.response.data); // Logging the error response
        return rejectWithValue(error.response.data.message || 'Failed to fetch job seeker.');
      }
      console.error('Unknown Error:', error); // Logging unknown errors
      return rejectWithValue('Failed to fetch job seeker.');
    }
  }
);

export const getSavedJobs = createAsyncThunk<Job[], string, { rejectValue: string }>(
  'jobSeeker/getSavedJobs',
  async (jobSeekerId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/jobs/saved-jobs/${jobSeekerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      return response.data.savedJobs;
    } catch (error) {
      return rejectWithValue('Failed to fetch saved jobs.');
    }
  }
);

export const toggleJobSave = createAsyncThunk<void, { jobId: string; jobSeekerId: string }, { rejectValue: string }>(
  'jobSeeker/toggleJobSave',
  async ({ jobId, jobSeekerId }, { rejectWithValue }) => {
    try {
      await axios.post(`${API_URL}/jobs/toggle-job-save`, { jobId, jobSeekerId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
    } catch (error) {
      return rejectWithValue('Failed to toggle job save.');
    }
  }
);

const jobSeekerSlice = createSlice({
  name: 'jobSeeker',
  initialState,
  reducers: {
    clearJobSeeker: (state) => {
      state.jobSeeker = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getJobSeekerById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getJobSeekerById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.jobSeeker = action.payload;
      })
      .addCase(getJobSeekerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch job seeker.';
      })
      .addCase(getSavedJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSavedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (state.jobSeeker) {
          state.jobSeeker.savedJobs = action.payload;
        }
      })
      .addCase(getSavedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch saved jobs.';
      })
      .addCase(toggleJobSave.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleJobSave.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(toggleJobSave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to toggle job save.';
      });
  },
});

export const { clearJobSeeker } = jobSeekerSlice.actions;
export default jobSeekerSlice.reducer;
