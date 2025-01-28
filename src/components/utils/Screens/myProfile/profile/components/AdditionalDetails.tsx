import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { TbLanguage } from "react-icons/tb";
import CreatableSelect from 'react-select/creatable';
import ISO6391 from 'iso-639-1';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileFormData } from '../Profile';
import { RootState, AppDispatch } from '@/store';
import { fetchProfile } from '@/store/slices/profileSlices';

interface AdditionalDetailsProps {
  formData: ProfileFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>;
  handleSave: (updates: Partial<ProfileFormData>) => void;
}

const AdditionalDetails: React.FC<AdditionalDetailsProps> = ({ formData, setFormData, handleSave }) => {
  const dispatch: AppDispatch = useDispatch();
  const jobSeeker = useSelector((state: RootState) => state.profile.jobSeeker);

  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState('');
  const [languages, setLanguages] = useState<string[]>(formData.languages || []);

  useEffect(() => {
    const storedId = localStorage.getItem('_id');
    const storedAccessToken = localStorage.getItem('accessToken');
    if (storedId && storedAccessToken) {
      dispatch(fetchProfile({ id: storedId, token: storedAccessToken }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (jobSeeker?.userInfo && jobSeeker.userInfo.email) {
      setEmail(jobSeeker.userInfo.email);
    }
  }, [jobSeeker]);

  useEffect(() => {
    setLanguages(formData.languages || []);
  }, [formData.languages]);

  const handleSaveClick = () => {
    handleSave({
      languages,
    });
    setIsEditing(false);
  };

  const handleLanguageChange = (selectedOptions: any) => {
    setLanguages(selectedOptions ? selectedOptions.map((option: any) => option.value) : []);
  };

  const languageOptions = ISO6391.getAllNames().map(name => ({
    label: name,
    value: name,
  }));

  return (
    <div className="border rounded-[20px] py-6 px-5 bg-background shadow-md">
      <div className="flex justify-between">
        <h1 className="text-modaltext text-2xl font-semibold">Additional Details</h1>
        <FaRegEdit className="text-signature border rounded-lg p-2 cursor-pointer" size={40} onClick={() => setIsEditing(true)} />
      </div>

      <div className="py-8">
        <div className="flex gap-5">
          <MdOutlineMailOutline className="text-signininput4" size={30} />
          <div>
            <h1 className="text-lg text-signininput4">Email</h1>
            <p className="text-lg text-modaltext">{email}</p>
          </div>
        </div>
      </div>
      <div>
        <div className="flex gap-5">
          <TbLanguage className="text-signininput4" size={30} />
          <div>
            <h1 className="text-lg text-signininput4">Languages</h1>
            <p className="text-lg text-modaltext">{(languages || []).join(', ')}</p> {/* Ensure languages is always an array */}
          </div>
        </div>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogTrigger asChild>
          <div></div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] p-6">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold">Edit Additional Details</DialogTitle>
            <DialogDescription className="text-md text-gray-500">
              Make changes to your additional details here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={email}
                  placeholder="Email"
                  className="w-full mt-2"
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="languages">Languages</Label>
                <CreatableSelect
                  id="languages"
                  isMulti
                  options={languageOptions}
                  value={languages.map((lang: string) => ({
                    label: lang,
                    value: lang,
                  }))}
                  onChange={handleLanguageChange}
                  className="w-full mt-2"
                  placeholder="Type and press enter to add new language"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button type="submit" onClick={handleSaveClick}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdditionalDetails;
