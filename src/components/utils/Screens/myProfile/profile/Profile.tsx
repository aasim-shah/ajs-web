import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import ProfileCompletion from "./components/ProfileCompletion";
import AdditionalDetails from "./components/AdditionalDetails";
import AboutMe from "./components/AboutMe";
import Experience from "./components/Experience";
import Educations from "./components/Educations";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import PersonalDetails from "./components/PersonalDetails";
import Resume from "./components/Resume";
import { RootState, AppDispatch } from '../../../../../store';
import { fetchProfile, updateProfile } from '../../../../../store/slices/profileSlices';

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  introduction: string;
  profession: string;
  skills: string[];
  languages: string[];
  city: string;
  province: string;
  country: string;
  nationality: string;
  postalCode: string;
  phone: string;
  profilePicture: string;
  company: string;
  openToOffers: boolean;
}

const Profile = () => {
  const dispatch: AppDispatch = useDispatch();
  const { jobSeeker } = useSelector((state: RootState) => state.profile);
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    gender: 'not-specified',
    dateOfBirth: '',
    introduction: 'Some Lorem Ipsum Text',
    profession: '',
    skills: [],
    languages: [],
    city: '',
    province: '',
    country: '',
    nationality: 'not-specified',
    postalCode: '0000',
    phone: '',
    profilePicture: '',
    company: '',
    openToOffers: false,
  });

  useEffect(() => {
    const storedId = localStorage.getItem('_id');
    const storedAccessToken = localStorage.getItem('accessToken');
    if (storedId && storedAccessToken) {
      dispatch(fetchProfile({ id: storedId, token: storedAccessToken }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (jobSeeker) {
      const latestExperience = jobSeeker.experience?.reduce((latest, current) => {
        return new Date(latest.to) > new Date(current.to) ? latest : current;
      }, jobSeeker.experience[0]);

      setFormData({
        firstName: jobSeeker.firstName || '',
        lastName: jobSeeker.lastName || '',
        gender: jobSeeker.gender || 'not-specified',
        dateOfBirth: jobSeeker.dateOfBirth || '',
        introduction: jobSeeker.introduction || 'Some Lorem Ipsum Text',
        profession: jobSeeker.profession || '',
        skills: jobSeeker.skills || [],
        languages: jobSeeker.languages || [],
        city: jobSeeker.city || '',
        province: jobSeeker.province || '',
        country: jobSeeker.country || '',
        nationality: jobSeeker.nationality || 'not-specified',
        postalCode: jobSeeker.postalCode || '0000',
        phone: jobSeeker.phone || '',
        profilePicture: jobSeeker.profilePicture || '',
        company: latestExperience?.companyName || '',
        openToOffers: jobSeeker.openToOffers || false,
      });
    }
  }, [jobSeeker]);

  const handleSave = (updates: Partial<ProfileFormData>) => {
    const updatedData = { ...formData, ...updates };

    // Set defaults for fields if they are empty
    const finalData = {
      ...updatedData,
      introduction: updatedData.introduction || 'Default introduction',
      nationality: updatedData.nationality || 'Not specified',
      postalCode: updatedData.postalCode || '0000',
      gender: updatedData.gender || 'not-specified', // Correct value
    };

    // Client-side validation
    const errors = [];
    if (!finalData.firstName || !finalData.lastName) {
      errors.push("First Name and Last Name are required.");
    }
    if (finalData.introduction.length < 10) {
      errors.push("Introduction should be at least 10 characters long.");
    }
    if (!finalData.nationality) {
      errors.push("Nationality should be at least 1 character long.");
    }
    if (!finalData.postalCode) {
      errors.push("Postal Code should be at least 1 character long.");
    }

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    setFormData(finalData);

    const storedId = localStorage.getItem('_id');
    const storedAccessToken = localStorage.getItem('accessToken');

    if (storedId && storedAccessToken) {
      dispatch(updateProfile({ id: storedId, updates: finalData, token: storedAccessToken }));
    }
  };

  return (
    <div>
      <div className="md:flex px-4 py-5 md:gap-10">
        <div className="md:w-2/3 w-full">
          <ProfileCompletion formData={formData} setFormData={setFormData} handleSave={handleSave} />
          <div className="my-10">
            <AboutMe formData={formData} setFormData={setFormData} handleSave={handleSave} />
          </div>
          <div className="my-10">
            <Experience />
          </div>
          <div className="my-10">
            <Educations />
          </div>
          <div className="my-10">
            <Projects />
          </div>
          <div className="my-10">
            <Skills formData={formData} setFormData={setFormData} handleSave={handleSave} />
          </div>
        </div>
        <div className="md:w-1/3 w-full">
          <AdditionalDetails formData={formData} setFormData={setFormData} handleSave={handleSave} />
          <div className="my-10">
            <PersonalDetails formData={formData} setFormData={setFormData} handleSave={handleSave} />
          </div>
          <div className="my-10">
            <Resume />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
