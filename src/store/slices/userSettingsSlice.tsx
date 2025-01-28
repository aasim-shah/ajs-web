// src/store/slices/userSettingSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../store';

interface UserSettingState {
  email: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserSettingState = {
  email: '',
  status: 'idle',
  error: null,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const changePassword = createAsyncThunk<void, { oldPassword: string; newPassword: string }, { rejectValue: string; state: RootState }>(
  'userSettings/changePassword',
  async ({ oldPassword, newPassword }, { rejectWithValue, getState }) => {
    const state = getState();
    const email = state.userSettings.email;
    try {
      await axios.patch(`${API_URL}/auth/change-password`, { email, oldPassword, newPassword }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'An error occurred while changing the password.');
      } else {
        return rejectWithValue('An unknown error occurred');
      }
    }
  }
);

const userSettingsSlice = createSlice({
  name: 'userSettings',
  initialState,
  reducers: {
    setEmailForUserSettings: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changePassword.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'failed';
        state.error = action.payload || 'An unknown error occurred';
      });
  },
});

export const { setEmailForUserSettings } = userSettingsSlice.actions;

export default userSettingsSlice.reducer;
