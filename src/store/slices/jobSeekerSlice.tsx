import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../index';
import { Job, JobSeekerState } from './types';

interface GetSavedJobsArgs {
  jobSeekerId: string;
  accessToken: string;
}

interface ToggleSaveJobArgs {
  jobId: string;
  jobSeekerId: string;
  accessToken: string;
}

interface ApplyForJobArgs {
  jobId: string;
  jobSeekerId: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL
const getAuthToken = () => {
  const token = localStorage.getItem('accessToken');
  return token;
};

export const fetchAppliedJobs = createAsyncThunk<Job[], string>(
  'jobs/fetchAppliedJobs',
  async (jobSeekerId, { rejectWithValue }) => {
    const token = getAuthToken();
    if (!token) return rejectWithValue('Access token is missing');

    try {
      const response = await axios.get(`${API_URL}/job-applications/job-seeker/all-applications/${jobSeekerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    
      return response.data.appliedJobs;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error fetching applied jobs:', error.response.data);
        return rejectWithValue(error.response.data.message || 'Failed to fetch applied jobs.');
      }
      return rejectWithValue('Failed to fetch applied jobs.');
    }
  }
);

export const getSavedJobs = createAsyncThunk<Job[], GetSavedJobsArgs>(
  'jobSeekers/getSavedJobs',
  async ({ jobSeekerId }, { rejectWithValue }) => {
    const token = getAuthToken();
    if (!token) {
      return rejectWithValue('Access token is missing');
    }

    try {
      const response = await axios.get(`${API_URL}/jobs/saved-jobs/${jobSeekerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const savedJobs = response.data.jobs.map((item: any) => ({
        _id: item._id,
        title: item.title,
        company: {
          companyName: item.company.companyName,
          companyLogo: item.company.companyLogo || '',
          city: item.company.city || '',
          province: item.company.province || '',
          country: item.company.country || '',
          sector: item.company.sector || '',
        },
        salary: item.salary,
        skills: item.skills,
        jobType: item.jobType,
        careerLevel: item.careerLevel,
        description: item.description,
        availability: item.availability,
        candidateType: item.candidateType,
        active: item.active,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));

   
      return savedJobs;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('API Error fetching saved jobs:', error.response.data);
        return rejectWithValue(error.response.data.message || 'Failed to fetch saved jobs.');
      }
      console.error('Unknown Error:', error);
      return rejectWithValue('Failed to fetch saved jobs.');
    }
  }
);

export const toggleSaveJob = createAsyncThunk<string, ToggleSaveJobArgs>(
  'jobSeekers/toggleSaveJob',
  async ({ jobId, jobSeekerId }, { rejectWithValue }) => {
    const token = getAuthToken();
    if (!token) {
      return rejectWithValue('Access token is missing');
    }

    try {
      await axios.post(
        `${API_URL}/jobs/toggle-job-save`,
        { jobId, jobSeekerId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

  
      return jobId; // Return the jobId to identify the job in the reducer
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error toggling save job:', error.response.data);
        return rejectWithValue(error.response.data.message || 'Failed to toggle save job.');
      }
      return rejectWithValue('Failed to toggle save job.');
    }
  }
);

export const fetchJobById = createAsyncThunk<Job, string>(
  'jobSeekers/fetchJobById',
  async (jobId, { rejectWithValue }) => {
    const token = getAuthToken();
    if (!token) {
      return rejectWithValue('Access token is missing');
    }

    try {
      const response = await axios.get(`${API_URL}/job/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
     
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('API Error fetching job by ID:', error.response.data);
        return rejectWithValue(error.response.data.message || 'Failed to fetch job.');
      }
      console.error('Unknown Error:', error);
      return rejectWithValue('Failed to fetch job.');
    }
  }
);

export const applyForJob = createAsyncThunk<void, ApplyForJobArgs>(
  'jobSeekers/applyForJob',
  async ({ jobId, jobSeekerId }, { rejectWithValue }) => {
    const token = getAuthToken();
    if (!token) {
      return rejectWithValue('Access token is missing');
    }

    try {
      await axios.post(
        `${API_URL}/job-applications/job-seeker/apply`,
        { jobId, jobSeekerId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
     
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error applying for job:', error.response.data);
        return rejectWithValue(error.response.data.message || 'Failed to apply for job.');
      }
      return rejectWithValue('Failed to apply for job.');
    }
  }
);

const initialState: JobSeekerState = {
  jobSeeker: {
    _id: '',
    savedJobs: [],
    appliedJobs: [],
  },
  status: 'idle',
  error: null,
  applyError: null,
};

const jobSeekerSlice = createSlice({
  name: 'jobSeekers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Applied Jobs
      .addCase(fetchAppliedJobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAppliedJobs.fulfilled, (state, action: PayloadAction<Job[]>) => {
        if (state.jobSeeker) {
          state.jobSeeker.appliedJobs = action.payload;
        }
        state.status = 'succeeded'; // Reset status
      })
      .addCase(fetchAppliedJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Get Saved Jobs
      .addCase(getSavedJobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getSavedJobs.fulfilled, (state, action: PayloadAction<Job[]>) => {
        if (state.jobSeeker) {
          state.jobSeeker.savedJobs = action.payload;
        }
        state.status = 'succeeded'; // Reset status
      })
      .addCase(getSavedJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Toggle Save Job
      .addCase(toggleSaveJob.fulfilled, (state, action: PayloadAction<string>) => {
        if (state.jobSeeker) {
          const jobId = action.payload;
          const jobIndex = state.jobSeeker.savedJobs.findIndex((job) => job._id === jobId);
          if (jobIndex >= 0) {
            state.jobSeeker.savedJobs.splice(jobIndex, 1);
          } else {
            const jobToSave = state.jobSeeker.appliedJobs.find(job => job._id === jobId);
            if (jobToSave) state.jobSeeker.savedJobs.push(jobToSave);
          }
        }
        state.status = 'succeeded'; // Reset status if necessary
      })

      // Apply for Job
      .addCase(applyForJob.fulfilled, (state, action) => {
        if (state.jobSeeker) {
          const jobId = action.meta.arg.jobId;
          if (!state.jobSeeker.appliedJobs.some(job => job._id === jobId)) {
            state.jobSeeker.appliedJobs.push({ _id: jobId } as Job);
          }
        }
        state.status = 'succeeded'; // Reset status if necessary
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.applyError = action.payload as string;
        state.status = 'failed'; // Reset status if an error occurs
      });
  },
});


export default jobSeekerSlice.reducer;
