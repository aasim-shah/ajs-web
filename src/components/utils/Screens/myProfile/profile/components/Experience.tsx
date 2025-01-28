"use client";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaRegEdit } from 'react-icons/fa';
import { CiSquarePlus } from 'react-icons/ci';
import { AppDispatch, RootState } from '@/store';
import { fetchExperiences, addExperience, updateExperience, deleteExperience } from '@/store/slices/experienceSlice/experienceSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { RiDeleteBin5Line } from 'react-icons/ri';

interface ExperienceData {
  _id?: string;
  companyName: string;
  jobTitle: string;
  from: Date | null;
  to?: Date | null;
  onGoing?: boolean;
  description: string;
}

const Experience = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { experiences } = useSelector((state: RootState) => state.experience);
  const [localExperiences, setLocalExperiences] = useState<ExperienceData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<ExperienceData | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [from, setFrom] = useState<Date | null>(null);
  const [to, setTo] = useState<Date | null>(null);
  const [onGoing, setOnGoing] = useState(false);
  const [description, setDescription] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchExperiences());
  }, [dispatch]);

  useEffect(() => {
    setLocalExperiences(experiences);
  }, [experiences]);

  const handleEditClick = (experience: ExperienceData) => {
    setSelectedExperience(experience);
    setCompanyName(experience.companyName);
    setJobTitle(experience.jobTitle);
    setFrom(experience.from ? new Date(experience.from) : null);
    setTo(experience.to ? new Date(experience.to) : null);
    setOnGoing(experience.onGoing || false);
    setDescription(experience.description);
    setIsEditing(true);
    setValidationError(null);
  };

  const handleAddClick = () => {
    setSelectedExperience(null);
    setCompanyName('');
    setJobTitle('');
    setFrom(null);
    setTo(null);
    setOnGoing(false);
    setDescription('');
    setIsAdding(true);
    setValidationError(null);
  };

  const handleSave = async () => {
    if (description.trim().length < 10) {
      setValidationError('Description must be at least 10 characters long');
      return;
    }

    const experienceData: ExperienceData = {
      companyName,
      jobTitle,
      from,
      to: to || undefined,
      onGoing,
      description,
    };

    try {
      if (selectedExperience) {
      
        await dispatch(updateExperience({ experienceId: selectedExperience._id!, experience: experienceData })).unwrap();
        await dispatch(fetchExperiences()).unwrap(); // Fetch the latest experiences
        setIsEditing(false); // Close the dialog
        setSelectedExperience(null); // Reset selected experience
      } else {
        
        await dispatch(addExperience(experienceData)).unwrap();
        await dispatch(fetchExperiences()).unwrap(); // Fetch the latest experiences
        setIsAdding(false); // Close the dialog
      }

      setValidationError(null);
    } catch (error) {
      console.error('Failed to save experience:', error);
    }
  };

  const handleDeleteClick = (experience: ExperienceData) => {
    setSelectedExperience(experience);
    setIsDeleting(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedExperience) {
       
        await dispatch(deleteExperience({ experienceId: selectedExperience._id! })).unwrap();
        setLocalExperiences((prev) => prev.filter((exp) => exp._id !== selectedExperience._id));
        setIsDeleting(false);
        setSelectedExperience(null);
      }
    } catch (error) {
      console.error('Failed to delete experience:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    if (e.target.value.trim().length >= 10) {
      setValidationError(null);
    }
  };

  return (
    <div className="border rounded-[20px] py-6 px-5 bg-background shadow-md">
      <div className="flex justify-between mb-5">
        <h1 className="text-modaltext text-2xl font-semibold">Experiences</h1>
        <CiSquarePlus className="text-signature border rounded-lg p-2 cursor-pointer" size={40} onClick={handleAddClick} />
      </div>

      {localExperiences.length > 0 ? localExperiences.map((experience, index) => (
        <div key={experience?._id ?? index} className={`pb-5 mb-5 ${index !== localExperiences.length - 1 ? 'border-b' : ''}`}>
          <div className="flex justify-between gap-5">
            <div>
              <h1 className="text-lg font-semibold">{experience?.jobTitle || 'Untitled'}</h1>
              <div className="flex text-base text-signininput">
                <h1 className="text-modaltext font-medium">{experience?.companyName || 'Unknown Company'}</h1>
                .<h1>{experience?.from ? format(new Date(experience.from), "PPP") : ''} - {experience?.onGoing ? 'Present' : (experience?.to ? format(new Date(experience.to), "PPP") : '')}</h1>
              </div>
              <div>
                <p className="text-modaltext">{experience?.description || 'No description available'}</p>
              </div>
            </div>
            <div>
              <FaRegEdit className="text-signature border rounded-lg p-2 mb-3 cursor-pointer" size={40} onClick={() => handleEditClick(experience)} />
              <RiDeleteBin5Line className="text-red-500 cursor-pointer" size={30} onClick={() => handleDeleteClick(experience)} />
            </div>
          </div>
        </div>
      )) : (
        <div>No experiences found.</div>
      )}

      <Dialog open={isAdding || isEditing} onOpenChange={(open) => {
       
        if (!open) {
          setIsAdding(false);
          setIsEditing(false);
        }
      }}>
        <DialogContent className="sm:max-w-[600px] p-6">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold">{isAdding ? 'Add Experience' : 'Edit Experience'}</DialogTitle>
            <DialogDescription className="text-md text-gray-500">
              {isAdding ? 'Add your new experience here. Click save when you are done.' : 'Make changes to your experience here. Click save when you are done.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company Name" />
            </div>
            <div>
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input id="jobTitle" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Job Title" />
            </div>
            <div>
              <Label htmlFor="from">From</Label>
              <DatePicker
                selected={from}
                onChange={(date) => setFrom(date as Date)}
                className="w-full border rounded-lg p-2"
                placeholderText="Pick a date"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={101} // Show a range of 101 years (1950 to 2050)
                minDate={new Date(1950, 0, 1)}
                maxDate={new Date(2050, 11, 31)}
              />
            </div>
            <div>
              <Label htmlFor="to">To</Label>
              <DatePicker
                selected={to}
                onChange={(date) => setTo(date as Date)}
                className="w-full border rounded-lg p-2"
                placeholderText="Pick a date"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={101} // Show a range of 101 years (1950 to 2050)
                minDate={new Date(1950, 0, 1)}
                maxDate={new Date(2050, 11, 31)}
                disabled={onGoing}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="onGoing">Ongoing</Label>
              <input
                id="onGoing"
                type="checkbox"
                checked={onGoing}
                onChange={(e) => setOnGoing(e.target.checked)}
                className="ml-2"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <textarea id="description" className="w-full border rounded-lg p-4 text-lg" rows={4} value={description} onChange={handleChange} placeholder="Description" />
              {validationError && <p className="text-red-500">{validationError}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAdding(false);
              setIsEditing(false);
            }}>Cancel</Button>
            <Button type="submit" onClick={handleSave}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent className="sm:max-w-[400px] p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Confirm Delete</DialogTitle>
            <DialogDescription className="text-md text-gray-500">
              Are you sure you want to delete this experience? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleting(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Experience;
