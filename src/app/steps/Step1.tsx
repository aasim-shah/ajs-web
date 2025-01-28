"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ISO6391 from "iso-639-1";
import React, { useEffect, useState } from "react";
import { CompanyFormData } from "./MultiStepForm";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import API from "@/apiConfig/axiosInstance";
import Portal from "react-datepicker/dist/portal";
import { Textarea } from "@/components/ui/textarea";

interface StepProps {
  formData: CompanyFormData;
  setFormData: React.Dispatch<React.SetStateAction<CompanyFormData>>;
  nextStep: () => void;
  prevStep: () => void;
  submitForm: () => void;
  errors: { [key: string]: string };
}

const Step1: React.FC<StepProps> = ({
  formData,
  setFormData,
  nextStep,
  errors,
}) => {
  const languageOptions = ISO6391.getAllNames().map((name) => ({
    label: name,
    value: name,
  }));

  const handleLanguageChange = (selectedLanguage: string) => {
    const newLanguages = formData.languages.includes(selectedLanguage)
      ? formData.languages.filter((lang) => lang !== selectedLanguage)
      : [...formData.languages, selectedLanguage];
    setFormData({ ...formData, languages: newLanguages });
  };

  const removeLanguage = (language: string) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((lang) => lang !== language),
    });
  };

  const handleSizeChange = (value: string) => {
    setFormData({ ...formData, companySize: value });
  };

  const [sectors, setSectors] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sectorsResponse, servicesResponse] = await Promise.all([
          API.get("/api/v1/app/sectors"),
          API.get("/api/v1/app/services"),
        ]);
        setSectors(sectorsResponse.data.map((sector: any) => sector.name));
        setServices(servicesResponse.data.map((service: any) => service.name));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSectorChange = (selectedSector: string) => {
    setFormData({ ...formData, sector: selectedSector });
  };

  const handleServicesChange = (selectedService: string) => {
    const newServices = formData.services.includes(selectedService)
      ? formData.services.filter((service) => service !== selectedService)
      : [...formData.services, selectedService];
    setFormData({ ...formData, services: newServices });
  };

  const removeService = (service: string) => {
    setFormData({
      ...formData,
      services: formData.services.filter((s) => s !== service),
    });
  };

  const sizeOptions = [
    { label: "1-10", value: "1-10" },
    { label: "11-50", value: "11-50" },
    { label: "51-200", value: "51-200" },
    { label: "201-500", value: "201-500" },
    { label: "501-1000", value: "501-1000" },
    { label: "1000+", value: "1000+" },
  ];

  return (
    <div className="max-w-3xl border rounded-lg mx-auto p-4">
      <h2 className="text-3xl text-custom-dark-blue text-center font-bold my-10">
        Company Details
      </h2>
      <div className="grid w-full items-center gap-1.5 mb-10">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          type="text"
          id="companyName"
          placeholder="Enter company full name"
          value={formData.companyName}
          onChange={(e) =>
            setFormData({ ...formData, companyName: e.target.value })
          }
          className="w-full text-custom-gray-blue"
        />
        {errors.companyName && (
          <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>
        )}
      </div>

      {/* Company Size Select */}
      <div className="grid w-full items-center gap-1.5 mb-10">
        <Label htmlFor="companySize">Company Size</Label>
        <Select onValueChange={handleSizeChange} value={formData.companySize}>
          <SelectTrigger id="companySize" className="w-full">
            <SelectValue placeholder="Select company size" />
          </SelectTrigger>

          <SelectContent>
            {sizeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.companySize && (
          <p className="text-red-500 text-xs mt-1">{errors.companySize}</p>
        )}
      </div>

      {/* Founded Year Input */}
      <div className="grid w-full items-center gap-1.5 mb-10">
        <Label htmlFor="foundedYear">Founded Year</Label>
        <Input
          type="number"
          id="foundedYear"
          placeholder="Founded Year"
          value={formData.foundedYear}
          onChange={(e) =>
            setFormData({ ...formData, foundedYear: e.target.value })
          }
          className="w-full"
        />
        {errors.foundedYear && (
          <p className="text-red-500 text-xs mt-1">{errors.foundedYear}</p>
        )}
      </div>

      {/* Company Description Input */}
      <div className="grid w-full items-center gap-1.5 mb-10">
        <Label className="text-custom-dark-blue" htmlFor="companyDescription">
          Company Description
        </Label>
        <Textarea
          id="companyDescription"
          placeholder="Company Description"
          value={formData.companyDescription}
          onChange={(e) =>
            setFormData({ ...formData, companyDescription: e.target.value })
          }
          className="w-full"
        />
        {errors.companyDescription && (
          <p className="text-red-500 text-xs mt-1">
            {errors.companyDescription}
          </p>
        )}
      </div>

      {/* Sector Single Select */}
      <div className="grid w-full items-center gap-1.5 mb-10">
        <Label htmlFor="sector">Sector</Label>
        <Select onValueChange={handleSectorChange} value={formData.sector}>
          <SelectTrigger id="sector" className="w-full">
            <SelectValue placeholder="Select sector" />
          </SelectTrigger>
          <SelectContent>
            {sectors.map((sector) => (
              <SelectItem key={sector} value={sector}>
                {sector}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.sector && (
          <p className="text-red-500 text-xs mt-1">{errors.sector}</p>
        )}
      </div>

      {/* Services Multi-Select */}
      <div className="grid w-full items-center gap-1.5 mb-10">
        <Label htmlFor="services">Services</Label>
        <Select onValueChange={handleServicesChange} value="">
          <SelectTrigger id="services" className="w-full">
            <SelectValue placeholder="Select or type services" />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem
                key={service}
                value={service}
                onClick={() => handleServicesChange(service)}
                className={
                  formData.services.includes(service)
                    ? "bg-blue-500 text-white"
                    : ""
                }
              >
                {service}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formData.services.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.services.map((service) => (
              <span
                key={service}
                className="bg-secondary text-blue-800 rounded-full px-3 py-1 flex items-center text-sm"
              >
                {service}
                <button
                  onClick={() => removeService(service)}
                  className="ml-2 text-blue-800 hover:text-blue-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        {errors.services && (
          <p className="text-red-500 text-xs mt-1">{errors.services}</p>
        )}
      </div>

      {/* Languages Multi-Select (existing) */}
      <div className="grid w-full items-center gap-1.5 mb-10">
        <Label htmlFor="languages">Languages</Label>
        <Select onValueChange={handleLanguageChange} value="">
          <SelectTrigger id="languages" className="w-full">
            <SelectValue placeholder="Select or type languages" />
          </SelectTrigger>
          <SelectContent>
            {languageOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                onClick={() => handleLanguageChange(option.value)}
                className={
                  formData.languages.includes(option.value)
                    ? "bg-blue-500 text-white"
                    : ""
                }
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formData.languages.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.languages.map((language) => (
              <span
                key={language}
                className="bg-secondary text-blue-800 rounded-full px-3 py-1 flex items-center text-sm"
              >
                {language}
                <button
                  onClick={() => removeLanguage(language)}
                  className="ml-2 text-blue-800 hover:text-blue-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        {errors.languages && (
          <p className="text-red-500 text-xs mt-1">{errors.languages}</p>
        )}
      </div>

      <div className="flex justify-between">
        <Button onClick={nextStep} className="bg-signature w-full">
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Step1;
