import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface CompanyPlan {
  _id: string;
  name: string;
  jobPostingsLimit: number;
  offersLimit: number;
  price: number;
  duration: number;
  features: string[];
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface CompanyPlanState {
  plans: CompanyPlan[];
  selectedPlan: CompanyPlan | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  upgradeStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CompanyPlanState = {
  plans: [],
  selectedPlan: null,
  status: 'idle',
  upgradeStatus: 'idle',
  error: null,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL

const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

export const fetchCompanyPlans = createAsyncThunk<
  CompanyPlan[],
  void,
  { rejectValue: string }
>('companyPlans/fetchCompanyPlans', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/company-plans`);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || 'An error occurred while fetching company plans.');
    } else {
      return rejectWithValue('An unknown error occurred');
    }
  }
});

export const fetchCompanyPlanById = createAsyncThunk<
  CompanyPlan,
  string,
  { rejectValue: string }
>('companyPlans/fetchCompanyPlanById', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/company-plans/${id}`);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || 'An error occurred while fetching the company plan.');
    } else {
      return rejectWithValue('An unknown error occurred');
    }
  }
});

export const upgradeCompanySubscription = createAsyncThunk<
  any,
  { planName: string },
  { rejectValue: string }
>('companyPlans/upgradeCompanySubscription', async ({ planName }, { rejectWithValue }) => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    return rejectWithValue('Access token is missing');
  }

  try {
    const response = await axios.patch(
      `${API_URL}/company-plans/upgrade`,
      { planName }, // Changed from planId to planName
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || 'An error occurred while upgrading the subscription.');
    } else {
      return rejectWithValue('An unknown error occurred');
    }
  }
});

const companyPlansSlice = createSlice({
  name: 'companyPlans',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyPlans.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCompanyPlans.fulfilled, (state, action: PayloadAction<CompanyPlan[]>) => {
        state.status = 'succeeded';
        state.plans = action.payload;
      })
      .addCase(fetchCompanyPlans.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'failed';
        state.error = action.payload || 'An unknown error occurred';
      })
      .addCase(fetchCompanyPlanById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCompanyPlanById.fulfilled, (state, action: PayloadAction<CompanyPlan>) => {
        state.status = 'succeeded';
        state.selectedPlan = action.payload;
      })
      .addCase(fetchCompanyPlanById.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'failed';
        state.error = action.payload || 'An unknown error occurred';
      })
      .addCase(upgradeCompanySubscription.pending, (state) => {
        state.upgradeStatus = 'loading';
      })
      .addCase(upgradeCompanySubscription.fulfilled, (state) => {
        state.upgradeStatus = 'succeeded';
      })
      .addCase(upgradeCompanySubscription.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.upgradeStatus = 'failed';
        state.error = action.payload || 'An unknown error occurred';
      });
  },
});

export default companyPlansSlice.reducer;
