import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL   || 'https://ajs-server.hostdonor.com/api/v1';

export interface Education {
  _id?: string;
  levelOfEducation: string;
  institution: string;
  fieldOfStudy: string;
  from: string; // Date in string format
  to?: string; // Date in string format
  onGoing?: boolean;
  score?: string;
  scoreUnit?: string;
  description: string;
}

interface EducationState {
  educations: Education[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: EducationState = {
  educations: [],
  status: 'idle',
  error: null,
};

const getAuthData = () => {
  const token = localStorage.getItem('accessToken');
  const id = localStorage.getItem('_id');
  return { token, id };
};

// Thunk to add education
export const addEducation = createAsyncThunk<
  Education,
  Education,
  { rejectValue: string }
>('education/addEducation', async (education, { rejectWithValue }) => {
  const { token, id } = getAuthData();
  if (!token || !id) return rejectWithValue('Missing authentication data');

  try {
    const response = await axios.post(`${API_URL}/job-seeker/education`, education, {
      params: { jobSeekerId: id },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.education; // Ensure the API returns the new education object
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message || 'An error occurred while adding education.'
      );
    } else {
      return rejectWithValue('An unknown error occurred');
    }
  }
});

// Thunk to fetch educations
export const fetchEducations = createAsyncThunk<Education[], void, { rejectValue: string }>(
  'education/fetchEducations',
  async (_, { rejectWithValue }) => {
    const { token, id } = getAuthData();
    if (!token || !id) return rejectWithValue('Missing authentication data');

    try {
      const response = await axios.get(`${API_URL}/job-seeker/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.jobSeeker.education; // Adjust based on API response structure
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message || 'An error occurred while fetching educations.'
        );
      } else {
        return rejectWithValue('An unknown error occurred');
      }
    }
  }
);

// Thunk to update education
export const updateEducation = createAsyncThunk<
  Education,
  { educationId: string; education: Education },
  { rejectValue: string }
>('education/updateEducation', async ({ educationId, education }, { rejectWithValue }) => {
  const { token, id } = getAuthData();
  if (!token || !id) return rejectWithValue('Missing authentication data');

  try {
    const response = await axios.patch(`${API_URL}/job-seeker/education`, education, {
      params: { jobSeekerId: id, educationId },
      headers: { Authorization: `Bearer ${token}` },
    });

    const updatedEducation = { ...education, _id: educationId };
    return updatedEducation;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message || 'An error occurred while updating education.'
      );
    } else {
      return rejectWithValue('An unknown error occurred');
    }
  }
});

// Thunk to delete education
export const deleteEducation = createAsyncThunk<
  string,
  { educationId: string },
  { rejectValue: string }
>('education/deleteEducation', async ({ educationId }, { rejectWithValue }) => {
  const { token, id } = getAuthData();
  if (!token || !id) return rejectWithValue('Missing authentication data');

  try {
    await axios.delete(`${API_URL}/job-seeker/education`, {
      params: { jobSeekerId: id, educationId },
      headers: { Authorization: `Bearer ${token}` },
    });
    return educationId;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message || 'An error occurred while deleting education.'
      );
    } else {
      return rejectWithValue('An unknown error occurred');
    }
  }
});

const educationSlice = createSlice({
  name: 'education',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEducations.fulfilled, (state, action: PayloadAction<Education[]>) => {
        state.status = 'succeeded';
        state.educations = action.payload;
        state.error = null;
      })
      .addCase(fetchEducations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEducations.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'failed';
        state.error = action.payload ?? 'An error occurred while fetching educations.';
      })
      .addCase(addEducation.fulfilled, (state, action: PayloadAction<Education>) => {
        state.status = 'succeeded';
        state.educations.push(action.payload);
        state.error = null;
      })
      .addCase(addEducation.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addEducation.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'failed';
        state.error = action.payload ?? 'An error occurred while adding education.';
      })
      .addCase(updateEducation.fulfilled, (state, action: PayloadAction<Education>) => {
        state.status = 'succeeded';
        const index = state.educations.findIndex((edu) => edu._id === action.payload._id);
        if (index !== -1) {
          state.educations[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateEducation.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateEducation.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'failed';
        state.error = action.payload ?? 'An error occurred while updating education.';
      })
      .addCase(deleteEducation.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.educations = state.educations.filter((edu) => edu._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteEducation.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteEducation.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'failed';
        state.error = action.payload ?? 'An error occurred while deleting education.';
      });
  },
});

export default educationSlice.reducer;
