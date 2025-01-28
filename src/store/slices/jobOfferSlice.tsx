import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL

const getAuthData = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  return token;
};

export interface JobOffer {
  _id: string;
  jobTitle: string;
  jobLocation?: string; // Optional if not always present
  createdAt?: string;   // Optional if not always present
  // Add other relevant properties for JobOffer
}

// Thunk for fetching job offers
export const fetchJobOffers = createAsyncThunk('jobOffers/fetchJobOffers', async (jobSeekerId: string, { rejectWithValue }) => {
  const token = getAuthData();
  if (!token) return rejectWithValue('Access token is missing');

  try {
    const response = await axios.get(`${API_URL}/job-offers/job-seeker/offered-jobs/${jobSeekerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.jobOffers;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message || 'An error occurred while fetching job offers.'
      );
    } else {
      return rejectWithValue('An unknown error occurred');
    }
  }
});

// Thunk for rejecting a job offer
export const rejectJobOffer = createAsyncThunk('jobOffers/rejectJobOffer', async (offerId: string, { rejectWithValue }) => {
  const token = getAuthData();
  if (!token) return rejectWithValue('Access token is missing');

  try {
    await axios.patch(`${API_URL}/job-offers/job-seeker/reject-offer/${offerId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return offerId; // Return the ID of the rejected offer to update the state
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message || 'An error occurred while rejecting the job offer.'
      );
    } else {
      return rejectWithValue('An unknown error occurred');
    }
  }
});

// Thunk for accepting a job offer
export const acceptJobOffer = createAsyncThunk('jobOffers/acceptJobOffer', async ({ offerId, interviewDate, interviewTime }: { offerId: string, interviewDate: string, interviewTime: string }, { rejectWithValue }) => {
  const token = getAuthData();
  if (!token) return rejectWithValue('Access token is missing');

  try {
    await axios.patch(`${API_URL}/job-offers/job-seeker/accept-offer/${offerId}`, { interviewDate, interviewTime }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return offerId; // Return the ID of the accepted offer to update the state
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message || 'An error occurred while accepting the job offer.'
      );
    } else {
      return rejectWithValue('An unknown error occurred');
    }
  }
});

interface JobOfferState {
  jobOffers: JobOffer[];
  currentPage: number;
  totalPages: number;
  totalJobOffers: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: JobOfferState = {
  jobOffers: [],
  currentPage: 1,
  totalPages: 0,
  totalJobOffers: 0,
  status: 'idle',
  error: null,
};

const jobOfferSlice = createSlice({
  name: 'jobOffers',
  initialState,
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobOffers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchJobOffers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.jobOffers = action.payload;
        state.totalJobOffers = action.payload.length;
        state.totalPages = Math.ceil(action.payload.length / 10); // Assuming 10 job offers per page
      })
      .addCase(fetchJobOffers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(rejectJobOffer.fulfilled, (state, action) => {
        state.jobOffers = state.jobOffers.filter((offer) => offer._id !== action.payload);
      })
      .addCase(rejectJobOffer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(acceptJobOffer.fulfilled, (state, action) => {
        state.jobOffers = state.jobOffers.map((offer) =>
          offer._id === action.payload ? { ...offer, status: 'accepted' } : offer
        );
      })
      .addCase(acceptJobOffer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export const { setCurrentPage } = jobOfferSlice.actions;
export default jobOfferSlice.reducer;
