"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CiSquarePlus } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { fetchSkills, Skill } from "@/store/slices/profileSlices";
import { RootState, AppDispatch } from "@/store";
import { ProfileFormData } from "../Profile";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SkillsProps {
  formData: ProfileFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>;
  handleSave: (updates: Partial<ProfileFormData>) => void;
}

const Skills: React.FC<SkillsProps> = ({ formData, setFormData, handleSave }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { skills, status } = useSelector((state: RootState) => state.profile);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchSkills());
  }, [dispatch]);

  useEffect(() => {
    if (skills.length > 0) {
      const initialSelectedSkills = formData.skills
        .map(skillName => skills.find(skill => skill.name === skillName))
        .filter((skill): skill is Skill => skill !== undefined);
      setSelectedSkills(initialSelectedSkills);
    }
  }, [skills, formData.skills]);

  const handleAddClick = () => {
    setIsDialogOpen(true);
  };

  const handleSaveSkills = () => {
    const updatedSkills = selectedSkills.map(skill => skill.name);
    setFormData({ ...formData, skills: updatedSkills });
    setIsDialogOpen(false);
    handleSave({ skills: updatedSkills });
  };

  const handleDelete = (skillName: string) => {
    setSkillToDelete(skillName);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (skillToDelete) {
      const updatedSkills = formData.skills.filter((s) => s !== skillToDelete);
      setFormData({ ...formData, skills: updatedSkills });
      handleSave({ skills: updatedSkills });
      setSkillToDelete(null);
    }
    setIsDeleteConfirmOpen(false);
  };

  const handleSkillToggle = (skill: Skill) => {
    setSelectedSkills(prev =>
      prev.some(s => s._id === skill._id)
        ? prev.filter(s => s._id !== skill._id)
        : [...prev, skill]
    );
  };

  return (
    <div className="border rounded-[20px]   bg-background shadow-md py-6 px-5 ">
      <div className="flex justify-between mb-5">
        <h1 className="text-modaltext text-2xl font-semibold">Skills</h1>
        <CiSquarePlus
          className="text-signature border rounded-lg p-2 cursor-pointer"
          size={40}
          onClick={handleAddClick}
        />
      </div>

      <div className="flex gap-3 flex-wrap">
        {formData.skills.map((skill, index) => (
          <div key={index} className="flex items-center gap-2">
            <Button className="bg-bglite text-base text-signature">
              {skill}
            </Button>
            <IoMdClose
              className="text-red-500 cursor-pointer"
              size={24}
              onClick={() => handleDelete(skill)}
            />
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div></div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px] p-6 max-h-[500px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold">Select Skills</DialogTitle>
            <DialogDescription className="text-md text-gray-500">
              Select multiple skills.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  Select Skills
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 max-h-80 overflow-y-auto" align="end">
                <DropdownMenuLabel>Skills</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {skills.map(skill => (
                  <DropdownMenuCheckboxItem
                    key={skill._id}
                    checked={selectedSkills.some(s => s._id === skill._id)}
                    onCheckedChange={() => handleSkillToggle(skill)}
                  >
                    {skill.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSaveSkills}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogTrigger asChild>
          <div></div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px] p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Confirm Delete</DialogTitle>
            <DialogDescription className="text-md text-gray-500">
              Are you sure you want to delete this skill? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Skills;
