import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegEdit } from "react-icons/fa";
import { CiSquarePlus } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { AppDispatch, RootState } from "@/store";
import { addEducation, fetchEducations, updateEducation, deleteEducation, Education } from "@/store/slices/educationslice/educationSlice";

const Educations = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { educations, status } = useSelector((state: RootState) => state.education);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState<Education | null>(null);
  const [educationText, setEducationText] = useState("");
  const [levelOfEducation, setLevelOfEducation] = useState("");
  const [institution, setInstitution] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [from, setFrom] = useState<Date | null>(null);
  const [to, setTo] = useState<Date | null>(null);
  const [onGoing, setOnGoing] = useState(false);
  const [score, setScore] = useState("");
  const [scoreUnit, setScoreUnit] = useState("");

  useEffect(() => {
    dispatch(fetchEducations());
  }, [dispatch]);

  useEffect(() => {
    if (selectedEducation) {
      setEducationText(selectedEducation.description);
      setLevelOfEducation(selectedEducation.levelOfEducation);
      setInstitution(selectedEducation.institution);
      setFieldOfStudy(selectedEducation.fieldOfStudy);
      setFrom(selectedEducation.from ? new Date(selectedEducation.from) : null);
      setTo(selectedEducation.to ? new Date(selectedEducation.to) : null);
      setOnGoing(selectedEducation.onGoing || false);
      setScore(selectedEducation.score || "");
      setScoreUnit(selectedEducation.scoreUnit || "");
    }
  }, [selectedEducation]);

  const handleEditClick = (education: Education) => {
    setSelectedEducation(education);
    setIsEditing(true);
  };

  const handleAddClick = () => {
    setSelectedEducation(null);
    setEducationText("");
    setLevelOfEducation("");
    setInstitution("");
    setFieldOfStudy("");
    setFrom(null);
    setTo(null);
    setOnGoing(false);
    setScore("");
    setScoreUnit("");
    setIsAdding(true);
  };

  const handleSave = async () => {
    const educationData: Education = {
      levelOfEducation,
      institution,
      fieldOfStudy,
      from: from ? from.toISOString() : "",
      to: to ? to.toISOString() : undefined,
      onGoing,
      score: score || undefined,
      scoreUnit: scoreUnit || undefined,
      description: educationText,
    };

    if (selectedEducation) {
      await dispatch(updateEducation({ educationId: selectedEducation._id!, education: educationData }));
    } else {
      const resultAction = await dispatch(addEducation(educationData));
      if (addEducation.fulfilled.match(resultAction)) {
        dispatch(fetchEducations()); // Fetch the latest educations
      }
    }

    setIsEditing(false);
    setIsAdding(false);
  };

  const handleDeleteClick = (education: Education) => {
    setSelectedEducation(education);
    setIsDeleting(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedEducation && selectedEducation._id) {
      await dispatch(deleteEducation({ educationId: selectedEducation._id }));
      setIsDeleting(false);
      setSelectedEducation(null);
      dispatch(fetchEducations()); // Fetch the latest educations
    }
  };

  return (
    <div className="border rounded-[20px] py-6 px-5 bg-background shadow-md">
      <div className="flex justify-between mb-5">
        <h1 className="text-modaltext text-2xl font-semibold">Educations</h1>
        <CiSquarePlus
          className="text-signature border rounded-lg p-2 cursor-pointer"
          size={40}
          onClick={handleAddClick}
        />
      </div>

      {educations.length > 0 ? (
        educations.map((education, index) => (
          education ? (
            <div key={education._id ? education._id : `temp-${index}`} className={`pb-5 mb-5 ${index !== educations.length - 1 ? 'border-b' : ''}`}>
              <div className="flex justify-between gap-5">
                <div className="">
              
                 <div >
                 <h1 className="text-modaltext mb-3 font-medium text-lg">{education.institution}</h1>
                 </div>
                  <div className="flex text-lg font-semibold text-signininput">
                  <h1  >{education.levelOfEducation} ,</h1>
                    <h1> { education.fieldOfStudy}</h1>
                   
                  </div>
                  <div className="flex gap-5 text-base mb-3 text-signininput" >
                  <h1>
                      {education.from ? format(new Date(education.from), "PPP") : "N/A"} - 
                      {education.onGoing ? 'Present' : education.to ? format(new Date(education.to), "PPP") : 'N/A'}
                   , </h1>
                    <h1 className="text-lg text-signininput"> {education.score} {education.scoreUnit}</h1>
                  </div>
                   
                  <div>
                    <p className="text-modaltext">{education.description}</p>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <FaRegEdit className="text-signature border rounded-lg p-2 cursor-pointer mb-2" size={40} onClick={() => handleEditClick(education)} />
                  {education._id && (
                    <RiDeleteBin5Line className="text-red-500 cursor-pointer" size={30} onClick={() => handleDeleteClick(education)} />
                  )}
                </div>
              </div>
            </div>
          ) : null
        ))
      ) : (
        <p>No education found</p>
      )}

      <Dialog open={isAdding || isEditing} onOpenChange={(open) => {
        if (!open) {
          setIsAdding(false);
          setIsEditing(false);
        }
      }}>
        <DialogContent className="sm:max-w-[600px] p-6 max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold">{isAdding ? 'Add Education' : 'Edit Education'}</DialogTitle>
            <DialogDescription className="text-md text-gray-500">
              {isAdding ? 'Add your new education here. Click save when you are done.' : 'Make changes to your education here. Click save when you are done.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <Label htmlFor="levelOfEducation">Level of Education</Label>
              <Input
                id="levelOfEducation"
                value={levelOfEducation}
                onChange={(e) => setLevelOfEducation(e.target.value)}
                placeholder="Level of Education"
              />
            </div>
            <div>
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="Institution"
              />
            </div>
            <div>
              <Label htmlFor="fieldOfStudy">Field of Study</Label>
              <Input
                id="fieldOfStudy"
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                placeholder="Field of Study"
              />
            </div>
            <div>
              <Label htmlFor="from">Start Date</Label>
              <DatePicker
                selected={from}
                onChange={(date) => setFrom(date)}
                className="w-full border rounded-lg p-2"
                placeholderText="Pick a date"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                dateFormat="MM/yyyy"
                minDate={new Date(new Date().getFullYear() - 30, 0, 1)}
                maxDate={new Date(new Date().getFullYear() + 30, 11, 31)}
              />
            </div>
            <div>
              <Label htmlFor="to">End Date</Label>
              <DatePicker
                selected={to}
                onChange={(date) => setTo(date)}
                className="w-full border rounded-lg p-2"
                placeholderText="Pick a date"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                dateFormat="MM/yyyy"
                minDate={new Date(new Date().getFullYear() - 30, 0, 1)}
                maxDate={new Date(new Date().getFullYear() + 30, 11, 31)}
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
              <Label htmlFor="score">Score</Label>
              <Input
                id="score"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="Score"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="scoreUnit">Score Unit</Label>
              <Input
                id="scoreUnit"
                value={scoreUnit}
                onChange={(e) => setScoreUnit(e.target.value)}
                placeholder="Score Unit"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                className="w-full border rounded-lg p-4 text-lg"
                rows={4}
                value={educationText}
                onChange={(e) => setEducationText(e.target.value)}
                placeholder="Description"
              />
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
              Are you sure you want to delete this education? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleting(false)}>Cancel</Button>
            <Button type="submit" onClick={handleDeleteConfirm}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Educations;
