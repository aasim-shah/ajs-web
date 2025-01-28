import React, { useState, useEffect } from 'react';
import { FaRegEdit } from "react-icons/fa";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from '@/components/ui/textarea';
import { Label } from "@/components/ui/label";

interface AboutMeProps {
  description: string;
  onUpdate: (updates: Partial<{ description: string }>) => Promise<void>;
}

const AboutMe: React.FC<AboutMeProps> = ({ description, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [desc, setDesc] = useState(description);

  useEffect(() => {
    setDesc(description);
  }, [description]);

  const handleSave = async () => {
    await onUpdate({ description: desc });
    setIsEditing(false);
  };
  

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDesc(e.target.value);
  };

  return (
    <div className="border p-6 rounded-[20px] relative">
      <div className="flex justify-between">
        <h1 className="text-modaltext text-2xl">Description</h1>
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <FaRegEdit className="text-signature border rounded-lg p-2 cursor-pointer" size={40} onClick={() => setIsEditing(true)} />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Edit Description</DialogTitle>
              <DialogDescription className="text-md text-gray-500">
                Make changes to your description here. Click save when you are done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <Label htmlFor="description" className="text-left">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={desc}
                  onChange={handleChange}
                  rows={10}
                  className="w-full border rounded-lg p-4"
                  placeholder="Enter description"
                />
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={handleSave}>
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className='text-signininput text-lg'>
        <p>{desc || "Enter description"}</p>
      </div>
    </div>
  );
};

export default AboutMe;
