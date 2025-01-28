// store/slices/CompanyRoleSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface CompanyRole {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  company: string;
  createdAt: string;
  updatedAt: string;
}

interface CompanyRoleState {
  roles: CompanyRole[];
  selectedRole: CompanyRole | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  registrationStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: CompanyRoleState = {
  roles: [],
  selectedRole: null,
  status: 'idle',
  error: null,
  registrationStatus: 'idle',
};

const API_URL = process.env.NEXT_PUBLIC_API_URL

const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

export const fetchCompanyRoles = createAsyncThunk<
  CompanyRole[],
  string,
  { rejectValue: string }
>('companyRole/fetchCompanyRoles', async (companyId, { rejectWithValue }) => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    return rejectWithValue('Access token is missing');
  }

  try {
    const response = await axios.get(`${API_URL}/company-roles/${companyId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.companyRoles;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || 'An error occurred while fetching company roles.');
    } else {
      return rejectWithValue('An unknown error occurred');
    }
  }
});

export const fetchCompanyRoleById = createAsyncThunk<
  CompanyRole,
  string,
  { rejectValue: string }
>('companyRole/fetchCompanyRoleById', async (roleId, { rejectWithValue }) => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    return rejectWithValue('Access token is missing');
  }

  try {
    const response = await axios.get(`${API_URL}/company-role/${roleId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || 'An error occurred while fetching the company role.');
    } else {
      return rejectWithValue('An unknown error occurred');
    }
  }
});

export const deleteCompanyRole = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('companyRole/deleteCompanyRole', async (roleId, { rejectWithValue }) => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    return rejectWithValue('Access token is missing');
  }

  try {
    await axios.delete(`${API_URL}/company-role/${roleId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return roleId;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || 'An error occurred while deleting the company role.');
    } else {
      return rejectWithValue('An unknown error occurred');
    }
  }
});

export const registerCompanyRole = createAsyncThunk<
  CompanyRole,
  { firstName: string; lastName: string; email: string; password: string; role: string; companyId: string },
  { rejectValue: string }
>('companyRole/registerCompanyRole', async (formData, { rejectWithValue }) => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    return rejectWithValue('Access token is missing');
  }

  try {
    const response = await axios.post(`${API_URL}/auth/register/company-role`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const newRole = response.data;
    return newRole;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || 'An error occurred while registering the company role.');
    } else {
      return rejectWithValue('An unknown error occurred');
    }
  }
});

export const updateCompanyRole = createAsyncThunk<
  CompanyRole,
  { roleId: string; formData: Partial<CompanyRole> },
  { rejectValue: string }
>('companyRole/updateCompanyRole', async ({ roleId, formData }, { rejectWithValue }) => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    return rejectWithValue('Access token is missing');
  }

  try {
    const response = await axios.put(`${API_URL}/company-role/${roleId}`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || 'An error occurred while updating the company role.');
    } else {
      return rejectWithValue('An unknown error occurred');
    }
  }
});

const companyRoleSlice = createSlice({
  name: 'companyRole',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyRoles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCompanyRoles.fulfilled, (state, action: PayloadAction<CompanyRole[]>) => {
        state.status = 'succeeded';
        state.roles = action.payload;
      })
      .addCase(fetchCompanyRoles.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'failed';
        state.error = action.payload || 'An unknown error occurred';
      })
      .addCase(fetchCompanyRoleById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCompanyRoleById.fulfilled, (state, action: PayloadAction<CompanyRole>) => {
        state.status = 'succeeded';
        state.selectedRole = action.payload;
      })
      .addCase(fetchCompanyRoleById.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'failed';
        state.error = action.payload || 'An unknown error occurred';
      })
      .addCase(updateCompanyRole.fulfilled, (state, action: PayloadAction<CompanyRole>) => {
        state.status = 'succeeded';
        const updatedRoleIndex = state.roles.findIndex(role => role._id === action.payload._id);
        if (updatedRoleIndex !== -1) {
          state.roles[updatedRoleIndex] = action.payload;
        }
      })
      .addCase(updateCompanyRole.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'failed';
        state.error = action.payload || 'An unknown error occurred';
      })
      .addCase(deleteCompanyRole.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteCompanyRole.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.roles = state.roles.filter(role => role._id !== action.payload);
      })
      .addCase(deleteCompanyRole.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'failed';
        state.error = action.payload || 'An unknown error occurred';
      })
      .addCase(registerCompanyRole.pending, (state) => {
        state.registrationStatus = 'loading';
      })
      .addCase(registerCompanyRole.fulfilled, (state, action: PayloadAction<CompanyRole>) => {
        state.registrationStatus = 'succeeded';
        state.roles.push(action.payload);
      })
      .addCase(registerCompanyRole.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.registrationStatus = 'failed';
        state.error = action.payload || 'An unknown error occurred';
      });
  },
});

export default companyRoleSlice.reducer;
