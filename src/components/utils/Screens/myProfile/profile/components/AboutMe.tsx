import React, { useState, useEffect } from 'react';
import { FaRegEdit } from "react-icons/fa";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ProfileFormData } from '../Profile';

interface AboutMeProps {
  formData: ProfileFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>;
  handleSave: (updates: Partial<ProfileFormData>) => void;
}

const AboutMe: React.FC<AboutMeProps> = ({ formData, setFormData, handleSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [aboutText, setAboutText] = useState(formData.introduction);

  useEffect(() => {
    setAboutText(formData.introduction);
  }, [formData.introduction]);

  const handleSaveClick = () => {
    handleSave({ introduction: aboutText });
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAboutText(e.target.value);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAboutText(formData.introduction);
  };

  return (
    <div className="border p-6 rounded-[20px] relative   py-6 px-5 bg-background shadow-md">
      <div className="flex justify-between items-center">
        <h1 className="text-modaltext text-2xl">About Me</h1>
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <FaRegEdit className="text-signature border rounded-lg p-2 cursor-pointer" size={40} onClick={() => setIsEditing(true)} />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] p-4">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold">Edit About Me</DialogTitle>
              <DialogDescription className="text-md text-gray-500">
                Make changes to your About Me section here. Click save when you are done.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <textarea
                className="w-full border rounded-lg p-4 text-lg"
                rows={10}
                value={aboutText}
                onChange={handleChange}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
              <Button type="submit" onClick={handleSaveClick}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className='text-signininput text-lg mt-4'>
        {aboutText.split('\n\n').map((paragraph, index) => (
          <p key={index} className="mb-4">{paragraph}</p>
        ))}
      </div>
    </div>
  );
};

export default AboutMe;
