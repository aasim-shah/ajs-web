import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Job } from './types'; // Assuming Job type is defined in './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface DeclineJobArgs {
  jobId: string;
  jobSeekerId: string;
} 

interface RejectApplicationArgs {
  applicationId: string;
}

interface GetDeclinedJobsArgs {
  jobSeekerId: string;
}

// Utility to get auth token from localStorage
const getAuthToken = () => {
  return typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
};

// Async Thunk for fetching applied jobs


// Async Thunk for declining or removing a job from declined jobs
export const declineJob = createAsyncThunk<void, DeclineJobArgs>(
  'jobs/declineJob',
  async ({ jobId, jobSeekerId }, { rejectWithValue }) => {
    const token = getAuthToken();
    if (!token) return rejectWithValue('Access token is missing');

    try {
      await axios.post(
        `${API_URL}/jobs/decline`,
        { jobId, jobSeekerId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to decline the job.');
      }
      return rejectWithValue('Failed to decline the job.');
    }
  }
);

// Async Thunk for rejecting a job application
export const rejectJobApplication = createAsyncThunk<void, RejectApplicationArgs>(
  'jobApplications/rejectJobApplication',
  async ({ applicationId }, { rejectWithValue }) => {
    const token = getAuthToken();
    if (!token) return rejectWithValue('Access token is missing');

    try {
      await axios.patch(
        `${API_URL}/job-applications/company/reject-application/${applicationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to reject the job application.');
      }
      return rejectWithValue('Failed to reject the job application.');
    }
  }
);

// Async Thunk for fetching declined jobs
export const getDeclinedJobs = createAsyncThunk<Job[], GetDeclinedJobsArgs>(
  'jobs/getDeclinedJobs',
  async ({ jobSeekerId }, { rejectWithValue }) => {
    const token = getAuthToken();
    if (!token) {
      console.error('Access token is missing');
      return rejectWithValue('Access token is missing');
    }

    try {
      const response = await axios.get(`${API_URL}/jobs/declined-jobs/${jobSeekerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.declinedJobs;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch declined jobs.');
      }
      return rejectWithValue('Failed to fetch declined jobs.');
    }
  }
);

// Initial state
const initialState: {
  declinedJobs: Job[];
  appliedJobs: Job[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
} = {
  declinedJobs: [],
  appliedJobs: [], // Adding appliedJobs to the state
  status: 'idle',
  error: null,
};

// Create Slice
const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
     
      .addCase(getDeclinedJobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getDeclinedJobs.fulfilled, (state, action: PayloadAction<Job[]>) => {
        state.declinedJobs = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(getDeclinedJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(declineJob.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(declineJob.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(declineJob.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(rejectJobApplication.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(rejectJobApplication.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(rejectJobApplication.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default jobSlice.reducer;
