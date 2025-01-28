import React, { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
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

interface PersonalDetailsProps {
  formData: ProfileFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>;
  handleSave: (updates: Partial<ProfileFormData>) => void;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({ formData, setFormData, handleSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValues, setInputValues] = useState({
    dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.split('T')[0] : '',
    nationality: formData.nationality,
    postalCode: formData.postalCode,
    gender: formData.gender,
  });

  useEffect(() => {
    setInputValues({
      dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.split('T')[0] : '',
      nationality: formData.nationality,
      postalCode: formData.postalCode,
      gender: formData.gender,
    });
  }, [formData]);

  const handleSaveClick = () => {
    handleSave(inputValues);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues({
      ...inputValues,
      [name]: value,
    });
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInputValues({
      ...inputValues,
      gender: e.target.value,
    });
  };

  return (
    <div className="border rounded-[20px] py-6 px-5 bg-background shadow-md">
      <div className="flex justify-between">
        <h1 className="text-modaltext text-2xl font-semibold">Personal Details</h1>
        <FaRegEdit className="text-signature border rounded-lg p-2 cursor-pointer" size={40} onClick={() => setIsEditing(true)} />
      </div>

      <div className="py-8">
        <div className="grid gap-5">
          <div className="flex gap-5">
            <h1 className="text-lg text-signininput4">Date of Birth</h1>
            <p className="text-lg text-modaltext">{inputValues.dateOfBirth}</p>
          </div>
          <div className="flex gap-5">
            <h1 className="text-lg text-signininput4">Nationality</h1>
            <p className="text-lg text-modaltext">{formData.nationality}</p>
          </div>
          <div className="flex gap-5">
            <h1 className="text-lg text-signininput4">Postal Code</h1>
            <p className="text-lg text-modaltext">{formData.postalCode}</p>
          </div>
          <div className="flex gap-5">
            <h1 className="text-lg text-signininput4">Gender</h1>
            <p className="text-lg text-modaltext">{formData.gender}</p>
          </div>
        </div>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogTrigger asChild>
          <div></div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px] p-6">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold">Edit Personal Details</DialogTitle>
            <DialogDescription className="text-md text-gray-500">
              Make changes to your personal details here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={inputValues.dateOfBirth}
                  onChange={handleChange}
                  placeholder="Date of Birth"
                  className="w-full mt-2"
                />
              </div>
              <div>
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  name="nationality"
                  value={inputValues.nationality}
                  onChange={handleChange}
                  placeholder="Nationality"
                  className="w-full mt-2"
                />
              </div>
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={inputValues.postalCode}
                  onChange={handleChange}
                  placeholder="Postal Code"
                  className="w-full mt-2"
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  name="gender"
                  value={inputValues.gender}
                  onChange={handleGenderChange}
                  className="w-full mt-2 p-2 border border-gray-300 rounded"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="not-specified">Other</option>
                </select>
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

export default PersonalDetails;
