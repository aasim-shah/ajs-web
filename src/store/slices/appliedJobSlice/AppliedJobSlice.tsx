import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Job {
  jobId: string;
  company: {
    companyName: string;
    companyLogo?: string;
  };
  role: string;
  dateApplied: string;
  status: 'In Review' | 'Shortlisted' | 'Processing';
  jobType: string;
  careerLevel: string;
  availability: string;
  salary?: {
    from: number;
    to: number;
  };
  description: string;
  skills: string[];
  benefits: string[];
  createdAt: string;
  city: string;
  province: string;
  country: string;
}

interface AppliedJobState {
  jobs: Job[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AppliedJobState = {
  jobs: [],
  status: 'idle',
  error: null,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const fetchAppliedJobs = createAsyncThunk<Job[], string>(
  'appliedJobs/fetchAppliedJobs',
  async (jobSeekerId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return rejectWithValue('No access token found.');
      }

      const response = await axios.get(`${API_URL}/job-applications/job-seeker/all-applications/${jobSeekerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.appliedJobs.map((appliedJob: any) => ({
        jobId: appliedJob._id,
        company: {
          companyName: appliedJob.job.company?.companyName || 'Unknown Company',
          companyLogo: appliedJob.job.company?.companyLogo || '',
        },
        role: appliedJob.job?.title || 'Unknown Role',
        dateApplied: new Date(appliedJob.createdAt).toLocaleDateString(),
        status: appliedJob.status as 'In Review' | 'Shortlisted' | 'Processing',
        jobType: appliedJob.job?.jobType || 'Not specified',
        careerLevel: appliedJob.job?.careerLevel || 'Not specified',
        availability: appliedJob.job?.availability || 'Not specified',
        salary: appliedJob.job?.salary || null,
        description: appliedJob.job?.description || 'No description provided.',
        skills: appliedJob.job?.skills || [],
        benefits: appliedJob.job?.benefits || [],
        createdAt: appliedJob.job?.createdAt || '',
        city: appliedJob.job?.city || 'Not specified',
        province: appliedJob.job?.province || 'Not specified',
        country: appliedJob.job?.country || 'Not specified',
      }));
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch applied jobs.');
      }
      return rejectWithValue('Failed to fetch applied jobs.');
    }
  }
);

export const deleteJobApplication = createAsyncThunk<string, string>(
  'appliedJobs/deleteJobApplication',
  async (applicationId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return rejectWithValue('No access token found.');
      }

      await axios.delete(`${API_URL}/job-applications/job-seeker/${applicationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return applicationId;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to delete job application.');
      }
      return rejectWithValue('Failed to delete job application.');
    }
  }
);

const appliedJobSlice = createSlice({
  name: 'appliedJobs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppliedJobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAppliedJobs.fulfilled, (state, action: PayloadAction<Job[]>) => {
        state.status = 'succeeded';
        state.jobs = action.payload;
        state.error = null;
      })
      .addCase(fetchAppliedJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(deleteJobApplication.fulfilled, (state, action: PayloadAction<string>) => {
        state.jobs = state.jobs.filter(job => job.jobId !== action.payload);
      })
      .addCase(deleteJobApplication.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default appliedJobSlice.reducer;
