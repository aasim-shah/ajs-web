import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { getSavedJobs } from '../../../../store/slices/jobSeekerSlice';

export const useFetchSavedJobs = (jobSeekerId: string | null, accessToken: string | null) => {
  const dispatch = useDispatch<AppDispatch>();
  const initialFetch = useRef(true);

  useEffect(() => {
    if (initialFetch.current && jobSeekerId && accessToken) {
 
      dispatch(getSavedJobs({ jobSeekerId, accessToken }));
      initialFetch.current = false;
    }
  }, [dispatch, jobSeekerId, accessToken]);
  
  const jobSeekerStatus = useSelector((state: RootState) => state.jobSeeker.status);
  const jobSeekerError = useSelector((state: RootState) => state.jobSeeker.error);
  const savedJobs = useSelector((state: RootState) => state.jobSeeker.jobSeeker?.savedJobs) || [];

  return { savedJobs, jobSeekerStatus, jobSeekerError };
};
