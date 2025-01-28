import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProfileFormData } from '../Profile';
import { Switch } from '@/components/ui/switch';
import { FiMapPin } from "react-icons/fi";
import { updateProfilePicture, fetchProfile, toggleOpenToOffers } from '@/store/slices/profileSlices';
import { Country, State, City, ICountry, IState, ICity } from 'country-state-city';

interface ProfileCompletionProps {  
  formData: ProfileFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>;
  handleSave: (updates: Partial<ProfileFormData>) => void;
}

const ProfileCompletion: React.FC<ProfileCompletionProps> = ({ formData, setFormData, handleSave }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobSeeker } = useSelector((state: RootState) => state.profile);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState<string>(formData.profilePicture || '/images/placeholderimage.png');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isChecked, setIsChecked] = useState(jobSeeker?.openToOffers || false);

  const [countries] = useState<ICountry[]>(Country.getAllCountries());
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  useEffect(() => {
    if (formData.country) {
      setStates(State.getStatesOfCountry(formData.country));
      if (formData.province) {
        setCities(City.getCitiesOfState(formData.country, formData.province));
      }
    }
  }, [formData.country, formData.province]);

  const handleCountryChange = (countryCode: string) => {
    setFormData((prev) => ({
      ...prev,
      country: countryCode,
      province: '',
      city: '',
    }));
    setStates(State.getStatesOfCountry(countryCode));
    setCities([]);
  };

  const handleStateChange = (stateCode: string) => {
    setFormData((prev) => ({
      ...prev,
      province: stateCode,
      city: '',
    }));
    setCities(City.getCitiesOfState(formData.country, stateCode));
  };

  const handleCityChange = (cityName: string) => {
    setFormData((prev) => ({
      ...prev,
      city: cityName,
    }));
  };

  // Set progress when jobSeeker data is available
  useEffect(() => {
    if (jobSeeker) {
      setProgress(jobSeeker.profileCompletion || 0);
    }
  }, [jobSeeker]);

  useEffect(() => {
    setProfileImagePreview(formData.profilePicture || '/images/placeholderimage.png');
  }, [formData.profilePicture]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
      const storedId = localStorage.getItem('_id') || '';
      const storedAccessToken = localStorage.getItem('accessToken') || '';

      if (storedId && storedAccessToken) {
        try {
          const updatedProfileData = await dispatch(updateProfilePicture({ id: storedId, file, token: storedAccessToken })).unwrap();
         
          setFormData((prevFormData) => ({
            ...prevFormData,
            profilePicture: updatedProfileData.profilePicture || '',
          }));

          dispatch(fetchProfile({ id: storedId, token: storedAccessToken }));
        } catch (error: any) {
          console.error('Failed to update profile picture:', error);
        }
      } else {
        console.error('No ID or access token found in local storage');
      }
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleSave(formData);
    setIsEditing(false);
  };

  const handleToggleOpenToOffers = async (checked: boolean) => {
    setIsChecked(checked);
    try {
      await dispatch(toggleOpenToOffers()).unwrap();
    } catch (error) {
      console.error('Failed to toggle open to offers:', error);
    }
  };

  return (
    <div className="border rounded-[20px] relative bg-background shadow-md">
      <div className="flex gap-4 items-center rounded-tr-[20px] rounded-tl-[20px] p-5 bg-darkGrey relative">
        <div className="w-1/3 md:relative">
          <div
            className="md:absolute border-8 rounded-full border-background md:left-[40px] md:top-[10px] w-24 h-24 md:w-36 md:h-36 overflow-hidden cursor-pointer"
            onClick={handleImageClick}
          >
            <Image
              src={profileImagePreview}
              alt="profile"
              width={150}
              height={150}
              className="rounded-full object-cover w-24 md:w-36"
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
          </div> 
        </div>
        <div className="md:w-2/3 w-full md:py-10">
          <div className="flex text-background justify-between">
            <div>
              <h1>Profile Completion</h1>
            </div>
            <div>
              <h1>{progress}%</h1>
            </div>
          </div>
          <Progress value={progress} color="bg-greenprogress" className="md:w-[100%] w-[80%]" />
        </div>
      </div>

      <div className="md:flex md:p-5 gap-3 md:gap-10">
        <div className="flex md:flex-col mt-5 gap-3 md:mt-16 md:items-center px-4 py-4 bg-switchbg rounded-lg md:w-1/3">
          <div>
            <Switch
              checked={isChecked}
              onCheckedChange={handleToggleOpenToOffers}
              checkedClassName="bg-greenprogress"
              uncheckedClassName="bg-gray-300 dark:bg-gray-300"
            />
          </div>
          <div className="text-greenprogress">
            <h1>OPEN FOR OPPORTUNITIES</h1>
          </div>
        </div>
        <div className="md:w-2/3 p-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="md:text-3xl text-xl text-modaltext">
                {formData.firstName} {formData.lastName}
              </h1>
              <p className="md:text-xl text-md text-signininput4 py-7">
  {formData.profession}
  {formData.company && ` at ${formData.company}`}
</p>
              <div className="flex items-center text-signininput4 gap-3">
                <FiMapPin />
                <p className="md:text-xl text-md text-signininput4">
                  {formData.city}, {formData.country}
                </p>
              </div>
            </div>
            <div>
              <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild>
                  <Button className="text-signature" variant="outline" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-lg p-6 max-h-[70vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
                    <DialogDescription className="text-md text-gray-500">
                      Make changes to your profile here. Click save when you are done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="firstName" className="text-right">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="lastName" className="text-right">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="profession" className="text-right">
                        Profession
                      </Label>
                      <Input
                        id="profession"
                        name="profession"
                        value={formData.profession}
                        onChange={handleChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="company" className="text-right">
                        Company
                      </Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="country" className="text-right">
                        Country
                      </Label>
                      <select
                        id="country"
                        value={formData.country}
                        onChange={(e) => handleCountryChange(e.target.value)}
                        className="col-span-3 p-2 border rounded"
                      >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                          <option key={country.isoCode} value={country.isoCode}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="state" className="text-right">
                        State
                      </Label>
                      <select
                        id="state"
                        value={formData.province}
                        onChange={(e) => handleStateChange(e.target.value)}
                        className="col-span-3 p-2 border rounded max-h-32 overflow-y-auto"
                        disabled={!states.length}
                      >
                        <option value="">Select State</option>
                        {states.map((state) => (
                          <option key={state.isoCode} value={state.isoCode}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="city" className="text-right">
                        City
                      </Label>
                      <select
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleCityChange(e.target.value)}
                        className="col-span-3 p-2 border rounded max-h-32 overflow-y-auto"
                        disabled={!cities.length}
                      >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                          <option key={city.name} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <DialogFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" onClick={handleSaveClick}>
                      Save changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletion;
