"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { postJob } from '../../../store/slices/postJobSlice';
import FormLeftSide from "./components/FormLeftSide";
import FormRightSide from "./components/FormRightSide";
import { useToast } from "@/components/ui/use-toast";
import Title from '@/components/Title';

// Define the type for form state and API payload
interface FormStateData {
  jobTitle: string;
  sector: string;
  skillsRequired: string[];
  country: string;
  city: string;
  province: string;
  description: string;
  benefits: string[];
  salaryFrom: string;
  salaryTo: string;
  urgency: string;
  careerLevel: string;
  jobType: string;
  candidateType: string;
  workPermitNeeded: boolean;
}

interface ApiFormData {
  title: string;
  sector: string;
  skills: string[];
  benefits: string[];
  salary: {
    from: number;
    to: number;
  };
  availability: string;
  careerLevel: string;
  jobType: string;
  candidateType: string;
  city: string;
  province: string;
  country: string;
  description: string;
}

const PostJob: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.postJob);
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormStateData>({
    jobTitle: "",
    sector: "",
    skillsRequired: [],
    country: "",
    city: "",
    province: "",
    description: "",
    benefits: [],
    salaryFrom: "",
    salaryTo: "",
    urgency: "",
    careerLevel: "",
    jobType: "",
    candidateType: "",
    workPermitNeeded: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleMultiSelectChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof FormStateData
  ) => {
    if (e.target instanceof HTMLInputElement) {
      const { value, checked } = e.target;
      const updatedValues = checked
        ? [...(formData[field] as string[]), value]
        : (formData[field] as string[]).filter((item) => item !== value);
      setFormData((prevData) => ({
        ...prevData,
        [field]: updatedValues,
      }));
    } else if (e.target instanceof HTMLSelectElement) {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setFormData((prevData) => ({
        ...prevData,
        [field]: selectedOptions
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const jobData: ApiFormData = {
      title: formData.jobTitle,
      sector: formData.sector,
      skills: formData.skillsRequired,
      benefits: formData.benefits,
      salary: {
        from: parseInt(formData.salaryFrom),
        to: parseInt(formData.salaryTo)
      },
      availability: formData.urgency,
      careerLevel: formData.careerLevel,
      jobType: formData.jobType,
      candidateType: formData.candidateType,
      city: formData.city,
      province: formData.province,
      country: formData.country,
      description: formData.description,
    };

   

    dispatch(postJob(jobData))
      .unwrap()
      .then((response) => {
        
        toast({
          description: "Job posted successfully.",
        });
        // Reset form data
        setFormData({
          jobTitle: "",
          sector: "",
          skillsRequired: [],
          country: "",
          city: "",
          province: "",
          description: "",
          benefits: [],
          salaryFrom: "",
          salaryTo: "",
          urgency: "",
          careerLevel: "",
          jobType: "",
          candidateType: "",
          workPermitNeeded: true,
        });
      })
      .catch((error) => {
        console.error("Dispatch error:", error);
        toast({
          description: "An error occurred while posting the job.",
        });
      });
  };

  return (

    // erefvfef
    <div className="w-full min-h-full flex flex-col bg-background  p-4">
      <Title title="Company Profile" >
    <div className="sm:w-full      rounded-lg">
      <h2 className="text-3xl font-bold text-center pb-10">Post a New Job</h2>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p className="text-red-500">An error occurred while posting the job: {error}</p>}
      {status === 'succeeded' && <p className="text-green-500">Job posted successfully!</p>}
      <form onSubmit={handleSubmit} className=" ">
        <div className="flex  sm:flex-row flex-col h-full ">
        <div className="w-full md:w-1/2 px-4 mb-4">
          <FormLeftSide
            formData={formData}
            handleChange={handleChange}
            handleMultiSelectChange={handleMultiSelectChange}
            setFormData={setFormData}
          />
        </div>
        <div className="w-full h-full md:w-1/2 px-4 pb-4">
          <FormRightSide
            formData={formData}
            handleChange={handleChange}
            handleMultiSelectChange={handleMultiSelectChange}
            handleSubmit={handleSubmit}
            setFormData={setFormData}
          />
        </div>
        </div>
      </form>
    </div>

    </Title>
    </div>
  );
};

export default PostJob;
