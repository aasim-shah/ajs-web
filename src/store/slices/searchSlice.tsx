import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Job, Company } from '@/store/slices/types'; // Ensure correct import path

const API_URL = process.env.NEXT_PUBLIC_API_URL

const getAuthData = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  return token;
};

export const fetchSearchedJobs = createAsyncThunk(
  'search/fetchSearchedJobs',
  async ({ search, city }: { search: string; city?: string }, { rejectWithValue }) => {
    const token = getAuthData();
    if (!token) return rejectWithValue('Access token is missing');

    try {
      const params: any = {};
      if (search.trim()) params.search = search.trim();
      if (city && city.trim()) params.city = city.trim();
      
     
      const response = await axios.get(`${API_URL}/jobs/search`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

    
      return response.data.jobs;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error response:", error.response.data); // Debug log
        return rejectWithValue(error.response.data.message || 'An error occurred while searching jobs.');
      } else {
        console.error("Unknown error:", error); // Debug log
        return rejectWithValue('An unknown error occurred');
      }
    }
  }
);

export const fetchSearchedCompanies = createAsyncThunk(
  'search/fetchSearchedCompanies',
  async ({ search }: { search: string }, { rejectWithValue }) => {
    const token = getAuthData();
    if (!token) return rejectWithValue('Access token is missing');

    try {
      const response = await axios.get(`${API_URL}/companies/search`, {
        params: { search },
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.companies;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'An error occurred while searching companies.');
      } else {
        return rejectWithValue('An unknown error occurred');
      }
    }
  }
);

export const fetchSearchedJobSeekers = createAsyncThunk(
  'search/fetchSearchedJobSeekers',
  async ({ search }: { search: string }, { rejectWithValue }) => {
    const token = getAuthData();
    if (!token) return rejectWithValue('Access token is missing');

    try {
      const response = await axios.get(`${API_URL}/job-seekers/search`, {
        params: { search },
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.jobSeekers;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'An error occurred while searching job seekers.');
      } else {
        return rejectWithValue('An unknown error occurred');
      }
    }
  }
);

interface SearchState {
  searchedJobs: Job[];
  searchedCompanies: Company[];
  searchedJobSeekers: any[]; // Assuming a specific type for job seekers
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SearchState = {
  searchedJobs: [],
  searchedCompanies: [],
  searchedJobSeekers: [],
  status: 'idle',
  error: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchedJobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSearchedJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.searchedJobs = action.payload;
      })
      .addCase(fetchSearchedJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(fetchSearchedCompanies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSearchedCompanies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.searchedCompanies = action.payload;
      })
      .addCase(fetchSearchedCompanies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(fetchSearchedJobSeekers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSearchedJobSeekers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.searchedJobSeekers = action.payload;
      })
      .addCase(fetchSearchedJobSeekers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default searchSlice.reducer;
