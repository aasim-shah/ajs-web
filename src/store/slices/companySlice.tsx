import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Contact {
  phone: string;
  isVerified: boolean;
}

interface SocialLinks {
  linkedin?: string;
  facebook?: string;
  instagram?: string;
}

interface UserInfo {
  contact: Contact;
  email: string;
  role: string;
}

export interface Company {
  _id: string;
  companyName: string;
  companyLogo: string;
  website: string;
  foundedYear: string;
  numberOfEmployees: string;
  sector: string;
  specialty?: string;
  city: string;
  province: string;
  location: string;
  plan: string;
  country: string;
  address: string;
  description: string;
  services?: string[];
  skills?: string[];
  companyImages?: string[];
  socialLinks?: SocialLinks;
  userInfo?: UserInfo;
  languages?: string[];
}

interface Job {
  _id: string;
  title: string;
  description: string;
}

interface Pagination {
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
}

interface CompanyState {
  companies: Company[];
  selectedCompany: Company | null;
  jobs: Job[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  registrationStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  pagination: Pagination;
  user: any; // Adjust as per your backend response structure
}

const initialState: CompanyState = {
  companies: [],
  selectedCompany: null,
  jobs: [],
  status: 'idle',
  registrationStatus: 'idle',
  error: null,
  pagination: {
    totalPages: 1,
    currentPage: 1,
    hasNextPage: false,
    hasPreviousPage: false,
    nextPage: null,
    previousPage: null,
  },
  user: null,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL

const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

export const fetchCompanies = createAsyncThunk<
  { companies: Company[]; pagination: Pagination },
  { page: number },
  { rejectValue: string }
>('company/fetchCompanies', async ({ page }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/companies?page=${page}`);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || 'An error occurred while fetching companies.');
    } else {
      return rejectWithValue('An unknown error occurred');
    }
  }
});

export const fetchCompanyById = createAsyncThunk<
  Company,
  string,
  { rejectValue: string }
>('company/fetchCompanyById', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/company/${id}`);
    return response.data.company;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || 'An error occurred while fetching the company.');
    } else {
      return rejectWithValue('An unknown error occurred');
    }
  }
});
  
export const fetchJobsByCompany = createAsyncThunk<
  Job[],
  string,
  { rejectValue: string } 
>('jobs/fetchJobsByCompany', async (companyId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/jobs/company/${companyId}`);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || 'An error occurred while fetching jobs.');
    } else {
      return rejectWithValue('An unknown error occurred');
    }
  }
});

export const registerCompanyRole = createAsyncThunk<
  any,
  { firstName: string; lastName: string; email: string; password: string; role: string },
  { rejectValue: string }
>('company/registerCompanyRole', async (userData, { rejectWithValue }) => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    return rejectWithValue('Access token is missing');
  }

  try {
    const response = await axios.post(`${API_URL}/auth/register/company-role`, userData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || 'An error occurred during registration.');
    } else {
      return rejectWithValue('An unknown error occurred');
    }
  }
});

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCompanies.fulfilled, (state, action: PayloadAction<{ companies: Company[]; pagination: Pagination }>) => {
        state.status = 'succeeded';
        state.companies = action.payload.companies;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCompanies.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'failed';
        state.error = action.payload || 'An unknown error occurred';
      })
      .addCase(fetchCompanyById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCompanyById.fulfilled, (state, action: PayloadAction<Company>) => {
        state.status = 'succeeded';
        state.selectedCompany = action.payload;
      })
      .addCase(fetchCompanyById.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'failed';
        state.error = action.payload || 'An unknown error occurred';
      })
      .addCase(fetchJobsByCompany.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchJobsByCompany.fulfilled, (state, action: PayloadAction<Job[]>) => {
        state.status = 'succeeded';
        state.jobs = action.payload;
      })
      .addCase(fetchJobsByCompany.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'failed';
        state.error = action.payload || 'An unknown error occurred';
      })
      .addCase(registerCompanyRole.pending, (state) => {
        state.registrationStatus = 'loading';
      })
      .addCase(registerCompanyRole.fulfilled, (state, action: PayloadAction<any>) => {
        state.registrationStatus = 'succeeded';
        state.user = action.payload;
      })
      .addCase(registerCompanyRole.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.registrationStatus = 'failed';
        state.error = action.payload || 'An unknown error occurred';
      });
  },
});

export default companySlice.reducer;
