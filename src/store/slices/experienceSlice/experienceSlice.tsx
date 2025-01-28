import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL   || 'https://ajs-server.hostdonor.com/api/v1';

interface Experience {
  _id?: string;
  companyName: string;
  jobTitle: string;
  from: Date | null;
  to?: Date | null;
  onGoing?: boolean;
  description: string;
}

interface ExperienceState {
  experiences: Experience[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ExperienceState = {
  experiences: [],
  status: 'idle',
  error: null,
};

const getAuthData = () => {
  const token = localStorage.getItem('accessToken');
  const id = localStorage.getItem('_id');
  return { token, id };
};

// Thunk to add experience
export const addExperience = createAsyncThunk<
  Experience,
  Experience,
  { rejectValue: string }
>('experience/addExperience', async (experience, { rejectWithValue }) => {
  const { token, id } = getAuthData();
  if (!token || !id) return rejectWithValue('Missing authentication data');

  try {
    const response = await axios.post(`${API_URL}/job-seeker/experience`, experience, {
      params: { jobSeekerId: id },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.experience;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message || 'An error occurred while adding experience.'
      );
    } else {
      return rejectWithValue('An unknown error occurred');
    }
  }
});

// Thunk to fetch experiences
export const fetchExperiences = createAsyncThunk<
  Experience[],
  void,
  { rejectValue: string }
>('experience/fetchExperiences', async (_, { rejectWithValue }) => {
  const { token, id } = getAuthData();
  if (!token || !id) return rejectWithValue('Missing authentication data');

  try {
    const response = await axios.get(`${API_URL}/job-seeker/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.jobSeeker.experience;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message || 'An error occurred while fetching experiences.'
      );
    } else {
      return rejectWithValue('An unknown error occurred');
    }
  }
});

// Thunk to update experience
export const updateExperience = createAsyncThunk<
  Experience,
  { experienceId: string; experience: Experience },
  { rejectValue: string }
>('experience/updateExperience', async ({ experienceId, experience }, { rejectWithValue }) => {
  const { token, id } = getAuthData();
  if (!token || !id) return rejectWithValue('Missing authentication data');

  try {
    const response = await axios.patch(`${API_URL}/job-seeker/experience`, experience, {
      params: { jobSeekerId: id, experienceId },
      headers: { Authorization: `Bearer ${token}` },
    });

    // Simulate API returning the updated experience object
    const updatedExperience = { ...experience, _id: experienceId };
    return updatedExperience;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message || 'An error occurred while updating experience.'
      );
    } else {
      return rejectWithValue('An unknown error occurred');
    }
  }
});

// Thunk to delete experience
export const deleteExperience = createAsyncThunk<
  string,
  { experienceId: string },
  { rejectValue: string }
>('experience/deleteExperience', async ({ experienceId }, { rejectWithValue }) => {
  const { token, id } = getAuthData();
  if (!token || !id) return rejectWithValue('Missing authentication data');

  try {
    await axios.delete(`${API_URL}/job-seeker/experience`, {
      params: { jobSeekerId: id, experienceId },
      headers: { Authorization: `Bearer ${token}` },
    });
    return experienceId;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message || 'An error occurred while deleting experience.'
      );
    } else {
      return rejectWithValue('An unknown error occurred');
    }
  }
});

const experienceSlice = createSlice({
  name: 'experience',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExperiences.fulfilled, (state, action: PayloadAction<Experience[]>) => {
        state.status = 'succeeded';
        state.experiences = action.payload;
        state.error = null;
      })
      .addCase(fetchExperiences.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchExperiences.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'failed';
        state.error = action.payload ?? 'An error occurred while fetching experiences.';
      })
      .addCase(addExperience.fulfilled, (state, action: PayloadAction<Experience>) => {
        state.status = 'succeeded';
        state.experiences.push(action.payload);
        state.error = null;
      })
      .addCase(addExperience.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addExperience.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'failed';
        state.error = action.payload ?? 'An error occurred while adding experience.';
      })
      .addCase(updateExperience.fulfilled, (state, action: PayloadAction<Experience>) => {
        state.status = 'succeeded';
        const index = state.experiences.findIndex((exp) => exp._id === action.payload._id);
        if (index !== -1) {
          state.experiences[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateExperience.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateExperience.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'failed';
        state.error = action.payload ?? 'An error occurred while updating experience.';
      })
      .addCase(deleteExperience.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.experiences = state.experiences.filter((exp) => exp._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteExperience.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteExperience.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'failed';
        state.error = action.payload ?? 'An error occurred while deleting experience.';
      });
  },
});

export default experienceSlice.reducer;
