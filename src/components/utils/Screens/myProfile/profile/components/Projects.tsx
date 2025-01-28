"use client";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaRegEdit } from 'react-icons/fa';
import { CiSquarePlus } from 'react-icons/ci';
import { AppDispatch, RootState } from '@/store';
import { fetchProjects, addProject, updateProject, deleteProject, Project } from '@/store/slices/projects/projectSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { RiDeleteBin5Line } from 'react-icons/ri';

const Projects = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, status } = useSelector((state: RootState) => state.project);
  const [localProjects, setLocalProjects] = useState<Project[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [from, setFrom] = useState<Date | null>(null);
  const [to, setTo] = useState<Date | null>(null);
  const [onGoing, setOnGoing] = useState(false);
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    if (projects && projects.length > 0) {
      const processedProjects = projects.map(project => ({
        ...project,
        link: project?.link ?? '',
      }));
      setLocalProjects(processedProjects);
    }
  }, [projects]);

  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
    setName(project.name);
    setCategory(project.category);
    setFrom(new Date(project.from));
    setTo(project.to ? new Date(project.to) : null);
    setOnGoing(project.onGoing || false);
    setDescription(project.description);
    setLink(project.link ?? '');
    setIsEditing(true);
    setValidationError(null);
  };

  const handleAddClick = () => {
    setSelectedProject(null);
    setName('');
    setCategory('');
    setFrom(null);
    setTo(null);
    setOnGoing(false);
    setDescription('');
    setLink('');
    setIsAdding(true);
    setValidationError(null);
  };

  const handleSave = async () => {
    // Reset validation errors
    setValidationError(null);
    setNameError(null);
    setCategoryError(null);
    setDateError(null);
    setLinkError(null);

    // Validate form
    let hasError = false;
    if (name.trim().length === 0) {
      setNameError('Project name is required');
      hasError = true;
    }
    if (description.trim().length < 10) {
      setValidationError('Description must be at least 10 characters long');
      hasError = true;
    }
    if (!category.trim()) {
      setCategoryError('Category is required');
      hasError = true;
    }
    if (!from) {
      setDateError('Start date is required');
      hasError = true;
    }
    if (!link.trim()) {
      setLinkError('Link is required');
      hasError = true;
    }

    if (hasError) return;

    const projectData: Project = {
      name,
      category,
      from: from ? from.toISOString() : '',
      to: to ? to.toISOString() : undefined,
      onGoing,
      description,
      link: link || '',
    };

    try {
      if (selectedProject) {
        await dispatch(updateProject({ projectId: selectedProject._id!, project: projectData })).unwrap();
        await dispatch(fetchProjects()).unwrap(); // Fetch the latest projects
        setIsEditing(false); // Close the dialog
        setSelectedProject(null); // Reset selected project
      } else {
        await dispatch(addProject(projectData)).unwrap();
        await dispatch(fetchProjects()).unwrap(); // Fetch the latest projects
        setIsAdding(false); // Close the dialog
      }
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const handleDeleteClick = (project: Project) => {
    setSelectedProject(project);
    setIsDeleting(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedProject) {
        await dispatch(deleteProject({ projectId: selectedProject._id! })).unwrap();
        setLocalProjects((prev) => prev.filter((proj) => proj._id !== selectedProject._id));
        setIsDeleting(false);
        setSelectedProject(null);
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  return (
    <div className="border rounded-[20px] py-6 px-5 bg-background shadow-md">
      <div className="flex justify-between border-b mb-5">
        <h1 className="text-modaltext text-2xl font-semibold">Projects</h1>
        <CiSquarePlus className="text-signature border rounded-lg p-2 cursor-pointer" size={40} onClick={handleAddClick} />
      </div>

      {status === 'loading' ? (
        <div>Loading...</div>
      ) : (
        localProjects.length > 0 ? (
          localProjects.map((project, index) => (
            <div key={project?._id ?? index} className={`pb-5 mb-5 ${index !== localProjects.length - 1 ? 'border-b' : ''}`}>
              <div className="flex justify-between gap-5">
                <div className="">
                  <h1 className="text-lg font-semibold">{project.name}</h1>
                  <div className="mt-2 text-base text-signininput">
                    <h1 className="text-modaltext">{project.category}</h1>
                  </div>
                  <div className="mt-2 py-3 text-base text-signininput">
                    <h1>
                      <span className="text-modaltext">Description:</span> {project.description}
                    </h1>
                    <h1>{project.from ? format(new Date(project.from), "PPP") : ''} - {project.onGoing ? 'Present' : (project.to ? format(new Date(project.to), "PPP") : '')}</h1>
                  </div>
                  {project.link && (
                    <div className="mt-2">
                      <h1 className="text-base text-signininput">
                        <span className="text-modaltext">Link:</span> <a href={project.link} target="_blank" rel="noopener noreferrer">{project.link}</a>
                      </h1>
                    </div>
                  )}
                </div>
                <div className='flex gap-3'>
                  <FaRegEdit className="text-signature border mb-3 rounded-lg p-2 cursor-pointer" size={40} onClick={() => handleEditClick(project)} />
                  <RiDeleteBin5Line className="text-red-500 cursor-pointer" size={30} onClick={() => handleDeleteClick(project)} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No projects found.</div>
        )
      )}

      <Dialog open={isAdding || isEditing} onOpenChange={(open) => {
        if (!open) {
          setIsAdding(false);
          setIsEditing(false);
        }
      }}>
        <DialogContent className="sm:max-w-[600px] p-6 max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold">{isAdding ? 'Add Project' : 'Edit Project'}</DialogTitle>
            <DialogDescription className="text-md text-gray-500">
              {isAdding ? 'Add your new project here. Click save when you are done.' : 'Make changes to your project here. Click save when you are done.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError(null); // Clear the error message when the user starts typing
                }}
                placeholder="Project Name"
              />
              {nameError && <p className="text-red-500 mt-1">{nameError}</p>}
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setCategoryError(null); // Clear the error message when the user starts typing
                }}
                placeholder="Category"
              />
              {categoryError && <p className="text-red-500 mt-1">{categoryError}</p>}
            </div>
            <div>
              <Label htmlFor="from">Start Date</Label>
              <DatePicker
                selected={from}
                onChange={(date) => {
                  setFrom(date as Date);
                  setDateError(null); // Clear the error message when the user selects a date
                }}
                className="w-full border rounded-lg p-2"
                placeholderText="Pick a date"
                showYearDropdown
                scrollableYearDropdown
                showMonthDropdown
                yearDropdownItemNumber={101} // Show a range of 101 years (1950 to 2050)
                minDate={new Date(1950, 0, 1)}
                maxDate={new Date(2050, 11, 31)}
              />
              {dateError && <p className="text-red-500 mt-1">{dateError}</p>}
            </div>
            <div>
              <Label htmlFor="to">End Date</Label>
              <DatePicker
                selected={to}
                onChange={(date) => setTo(date as Date)}
                className="w-full border rounded-lg p-2"
                placeholderText="Pick a date"
                showYearDropdown
                scrollableYearDropdown
                showMonthDropdown
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
                onChange={(e) => {
                  setOnGoing(e.target.checked);
                  if (e.target.checked) {
                    setTo(null); // Clear the end date if ongoing is checked
                  }
                }}
                className="ml-2"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                className="w-full border rounded-lg p-4 text-lg"
                rows={4}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setValidationError(null); // Clear the error message when the user starts typing
                }}
                placeholder="Description"
              />
              {validationError && <p className="text-red-500 mt-1">{validationError}</p>}
            </div>
            <div className="col-span-2">
              <Label htmlFor="link">Link</Label>
              <Input
                id="link"
                value={link}
                onChange={(e) => {
                  setLink(e.target.value);
                  setLinkError(null); // Clear the error message when the user starts typing
                }}
                placeholder="Project Link"
              />
              {linkError && <p className="text-red-500 mt-1">{linkError}</p>}
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
              Are you sure you want to delete this project? This action cannot be undone.
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

export default Projects;
