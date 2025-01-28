import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL   || 'https://ajs-server.hostdonor.com/api/v1';

export interface Project {
  _id?: string;
  name: string;
  category: string;
  from: string; // Date in string format
  to?: string; // Date in string format
  onGoing?: boolean;
  description: string;
  link?: string;
}

interface ProjectState {
  projects: Project[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  status: 'idle',
  error: null,
};

const getAuthData = () => {
  const token = localStorage.getItem('accessToken');
  const id = localStorage.getItem('_id');
  return { token, id };
};

// Thunk to add project
export const addProject = createAsyncThunk<
  Project,
  Project,
  { rejectValue: string }
>('project/addProject', async (project, { rejectWithValue }) => {
  const { token, id } = getAuthData();
  if (!token || !id) return rejectWithValue('Missing authentication data');

  try {
    const response = await axios.post(`${API_URL}/job-seeker/project`, project, {
      params: { jobSeekerId: id },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.project;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message || 'An error occurred while adding project.'
      );
    } else {
      return rejectWithValue('An unknown error occurred');
    }
  }
});

// Thunk to fetch projects
export const fetchProjects = createAsyncThunk<Project[], void, { rejectValue: string }>(
  'project/fetchProjects',
  async (_, { rejectWithValue }) => {
    const { token, id } = getAuthData();
    if (!token || !id) return rejectWithValue('Missing authentication data');

    try {
      const response = await axios.get(`${API_URL}/job-seeker/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
     
      return response.data.jobSeeker.projects; // Adjust based on API response structure
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message || 'An error occurred while fetching projects.'
        );
      } else {
        return rejectWithValue('An unknown error occurred');
      }
    }
  }
);

// Thunk to update project
export const updateProject = createAsyncThunk<
  Project,
  { projectId: string; project: Project },
  { rejectValue: string }
>('project/updateProject', async ({ projectId, project }, { rejectWithValue }) => {
  const { token, id } = getAuthData();
  if (!token || !id) return rejectWithValue('Missing authentication data');

  try {
    const response = await axios.patch(`${API_URL}/job-seeker/project`, project, {
      params: { jobSeekerId: id, projectId },
      headers: { Authorization: `Bearer ${token}` },
    });

    const updatedProject = { ...project, _id: projectId };
    return updatedProject;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message || 'An error occurred while updating project.'
      );
    } else {
      return rejectWithValue('An unknown error occurred');
    }
  }
});

// Thunk to delete project
export const deleteProject = createAsyncThunk<
  string,
  { projectId: string },
  { rejectValue: string }
>('project/deleteProject', async ({ projectId }, { rejectWithValue }) => {
  const { token, id } = getAuthData();
  if (!token || !id) return rejectWithValue('Missing authentication data');

  try {
    await axios.delete(`${API_URL}/job-seeker/project`, {
      params: { jobSeekerId: id, projectId },
      headers: { Authorization: `Bearer ${token}` },
    });
    return projectId;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message || 'An error occurred while deleting project.'
      );
    } else {
      return rejectWithValue('An unknown error occurred');
    }
  }
});

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
        state.status = 'succeeded';
        state.projects = action.payload;
        state.error = null;
       
      })
      .addCase(fetchProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjects.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'failed';
        state.error = action.payload ?? 'An error occurred while fetching projects.';
      })
      .addCase(addProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.status = 'succeeded';
        state.projects.push(action.payload);
        state.error = null;
      })
      .addCase(addProject.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addProject.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'failed';
        state.error = action.payload ?? 'An error occurred while adding project.';
      })
      .addCase(updateProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.status = 'succeeded';
        const index = state.projects.findIndex((proj) => proj._id === action.payload._id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProject.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProject.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'failed';
        state.error = action.payload ?? 'An error occurred while updating project.';
      })
      .addCase(deleteProject.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.projects = state.projects.filter((proj) => proj._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteProject.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteProject.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'failed';
        state.error = action.payload ?? 'An error occurred while deleting project.';
      });
  },
});

export default projectSlice.reducer;
