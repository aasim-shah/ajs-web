import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CiSquarePlus } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BiSolidFilePdf } from "react-icons/bi";
import { AppDispatch, RootState } from '@/store';
import { addOrUpdateResume, deleteResume, fetchProfile } from '@/store/slices/profileSlices';
import moment from 'moment';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Resume = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobSeeker } = useSelector((state: RootState) => state.profile);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [uploadDate, setUploadDate] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedId = localStorage.getItem('_id');
      const storedAccessToken = localStorage.getItem('accessToken');
      if (storedId && storedAccessToken) {
        dispatch(fetchProfile({ id: storedId, token: storedAccessToken }));
      }
    }
  }, [dispatch]);

  useEffect(() => {
    if (jobSeeker && jobSeeker.resume) {
      const resumeFileName = jobSeeker.resume.split('/').pop() || null; // Extract the file name from the URL or set to null
      setResumeUrl(jobSeeker.resume || null);
      setResumeFileName(resumeFileName);
      setUploadDate(jobSeeker.resumeUploadDate || null);
      setFileSize(jobSeeker.resumeFileSize || null);
    }
  }, [jobSeeker]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFileName(file.name);
      setFileSize(Math.round(file.size / 1024));
      setUploadDate(moment().format('DD MMM YYYY [at] hh:mm a'));

      if (typeof window !== 'undefined') {
        const storedId = localStorage.getItem('_id') || '';
        const storedAccessToken = localStorage.getItem('accessToken') || '';

        if (storedId && storedAccessToken) {
          try {
            const result = await dispatch(addOrUpdateResume({ id: storedId, file, token: storedAccessToken })).unwrap();
            if (result.resumeUrl) {
              setResumeUrl(result.resumeUrl);
             
            } else {
              console.error('No resume URL returned from the server');
            }
          } catch (error: any) {
            console.error('Failed to update resume:', error);
            setResumeUrl(null);
            setResumeFileName(null);
          }
        } else {
          console.error('No ID or access token found in local storage');
        }
      }
    }
  };

  const handleDelete = async () => {
    

    if (typeof window !== 'undefined') {
      const storedId = localStorage.getItem('_id') || '';
      const storedAccessToken = localStorage.getItem('accessToken') || '';

      if (storedId && storedAccessToken) {
        try {
          const jobSeekerData = await dispatch(fetchProfile({ id: storedId, token: storedAccessToken })).unwrap();
          const resumeToDelete = jobSeekerData.resume;
          if (resumeToDelete) {
            await dispatch(deleteResume({ filename: resumeToDelete, token: storedAccessToken })).unwrap();
        

            setResumeFileName(null);
            setResumeUrl(null);
            setUploadDate(null);
            setFileSize(null);
          } else {
            console.error('No resume URL found for deletion.');
          }
        } catch (error: any) {
          console.error('Failed to delete resume:', error);
          if (jobSeeker && jobSeeker.resume) {
            const resumeFileName = jobSeeker.resume.split('/').pop() || null; // Extract the file name from the URL or set to null
            setResumeUrl(jobSeeker.resume || null);
            setResumeFileName(resumeFileName);
            setUploadDate(jobSeeker.resumeUploadDate || null);
            setFileSize(jobSeeker.resumeFileSize || null);
          }
        }
      } else {
        console.error('No ID or access token available.');
      }
    }
    setIsDialogOpen(false);
  };

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const openDialog = () => {
   
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
 
    setIsDialogOpen(false);
  };

 

  return (
    <div className="border rounded-[20px] py-6 px-5 bg-background shadow-md">
      <div className="flex justify-between">
        <h1 className="text-modaltext text-2xl font-semibold">Resume/CV</h1>
        <CiSquarePlus
          className="text-signature border rounded-lg p-2 cursor-pointer"
          size={40}
          onClick={handleFileClick}
        />
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {resumeFileName && (
        <div className="py-8">
          <div className="flex items-center gap-5">
            <BiSolidFilePdf className="text-red-500" size={60} />
            <div className="flex flex-col">
              <a href={resumeUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-lg text-modaltext">
                {resumeFileName}
              </a>
              <span className="text-sm text-gray-500">{fileSize} Kb • {uploadDate}</span>
            </div>
            <RiDeleteBin5Line
              className="text-red-500 cursor-pointer"
              size={30}
              onClick={openDialog}
            />
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[400px] p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Confirm Delete</DialogTitle>
            <DialogDescription className="text-md text-gray-500">
              Are you sure you want to delete this resume? This action cannot be undone.
            </DialogDescription>
          </DialogHeader> 
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Resume;
