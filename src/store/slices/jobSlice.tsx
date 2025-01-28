import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Job, JobState, SavedJob } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL

const getAuthData = () => { 
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null; 
  return token;
};

export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async (page: number, { rejectWithValue }) => {
  const token = getAuthData();
  if (!token) return rejectWithValue('Access token is missing');

  try {
    const response = await axios.get(`${API_URL}/jobs?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message || 'An error occurred while fetching jobs.'
      );
    } else {
      return rejectWithValue('An unknown error occurred');
    }
  }
});

export const fetchSavedJobs = createAsyncThunk('jobs/fetchSavedJobs', async (jobSeekerId: string, { rejectWithValue }) => {
  const token = getAuthData();
  if (!token) return rejectWithValue('Access token is missing');

  try {
    const response = await axios.get(`${API_URL}/jobs/saved-jobs/${jobSeekerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.savedJobs;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message || 'An error occurred while fetching saved jobs.'
      );
    } else {
      return rejectWithValue('An unknown error occurred');
    }
  }
});

export const fetchJobById = createAsyncThunk('jobs/fetchJobById', async (jobId: string, { rejectWithValue }) => {
  const token = getAuthData();
  if (!token) return rejectWithValue('Access token is missing');

  try {
    const response = await axios.get(`${API_URL}/job/${jobId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.job;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message || 'An error occurred while fetching the job.'
      );
    } else {
      return rejectWithValue('An unknown error occurred');
    }
  }
});

export const fetchSimilarJobs = createAsyncThunk(
  'jobs/fetchSimilarJobs',
  async (currentJobId: string, { rejectWithValue }) => {
    const token = getAuthData();
    if (!token) return rejectWithValue('Access token is missing');

    try {
      const response = await axios.get(`${API_URL}/jobs/similar-jobs/${currentJobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.jobs;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message || 'An error occurred while fetching similar jobs.'
        );
      } else {
        return rejectWithValue('An unknown error occurred');
      }
    }
  }
);

export const fetchBestMatchedJobs = createAsyncThunk('jobs/fetchBestMatchedJobs', async (jobSeekerId: string, { rejectWithValue }) => {
  const token = getAuthData();
  if (!token) return rejectWithValue('Access token is missing');

  try {
    const response = await axios.get(`${API_URL}/jobs/best-matched/${jobSeekerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.jobs;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message || 'An error occurred while fetching best-matched jobs.'
      );
    } else {
      return rejectWithValue('An unknown error occurred');
    }
  }
});

const initialState: JobState = {
  jobs: [],
  savedJobs: [],
  job: null,
  bestMatchedJobs: [],
  similarJobs: [], // Add this line
  totalJobs: 0,
  totalPages: 0,
  currentPage: 1,
  status: 'idle',
  error: null,
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.jobs = action.payload.jobs.sort((a: Job, b: Job) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        state.totalJobs = action.payload.total;
        state.totalPages = action.payload.pagination.totalPages;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(fetchSavedJobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSavedJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.savedJobs = action.payload;
      })
      .addCase(fetchSavedJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(fetchJobById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.job = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(fetchBestMatchedJobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBestMatchedJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bestMatchedJobs = action.payload;
      })
      .addCase(fetchBestMatchedJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(fetchSimilarJobs.pending, (state) => { // Add this block
        state.status = 'loading';
      })
      .addCase(fetchSimilarJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.similarJobs = action.payload;
      })
      .addCase(fetchSimilarJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export const { setCurrentPage } = jobSlice.actions;
export default jobSlice.reducer;
