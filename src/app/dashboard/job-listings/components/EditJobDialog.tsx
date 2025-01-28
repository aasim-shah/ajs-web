"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { RiArrowDropDownLine, RiCloseLine } from "react-icons/ri";
import { Country, State, City } from "country-state-city";
import {
  fetchBenefits,
  fetchSectors,
  fetchSkills,
} from "@/store/slices/profileSlices";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { fetchCountriesData } from "@/store/slices/postJobSlice";

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

interface EditJobDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  formData: FormStateData;
  setFormData: React.Dispatch<React.SetStateAction<FormStateData>>;
}

const EditJobDialog: React.FC<EditJobDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
}) => {
  const [isSkillsDropdownOpen, setIsSkillsDropdownOpen] = useState(false);
  const [isBenefitsDropdownOpen, setIsBenefitsDropdownOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { skills, sectors, benefits } = useSelector(
    (state: RootState) => state.profile
  );
  const { countries } = useSelector((state: RootState) => state.postJob);

  // Destructure cities, provinces, and countries with unique values
  const cities = [...new Set(countries.map((location) => location.city))];
  const provinces = [
    ...new Set(countries.map((location) => location.province)),
  ];
  const countrieslist = [
    ...new Set(countries.map((location) => location.country)),
  ];

  const benefitsOptions = ["Dental", "Car", "Flat", "Overtimepay"];
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>(
    formData.benefits || []
  );

  useEffect(() => {
    if (isOpen) {
      setSelectedBenefits(formData.benefits || []);
      dispatch(fetchSkills());
      dispatch(fetchSectors());
      dispatch(fetchBenefits());
      // dispatch(fetchCountriesData());
    }
  }, [isOpen, formData.benefits, dispatch]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      benefits: selectedBenefits,
    }));
  }, [selectedBenefits, setFormData]);

  const handleBenefitToggle = (benefit: string) => {
    const updatedBenefits = selectedBenefits.includes(benefit)
      ? selectedBenefits.filter((b) => b !== benefit)
      : [...selectedBenefits, benefit];

    setSelectedBenefits(updatedBenefits);
  };

  const handleDeleteBenefit = (benefit: string) => {
    const updatedBenefits = selectedBenefits.filter((b) => b !== benefit);
    setSelectedBenefits(updatedBenefits);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleMultiSelectChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof FormStateData
  ) => {
    const { value, checked } = e.target;
    const updatedValues = checked
      ? [...(formData[field] as string[]), value]
      : (formData[field] as string[]).filter((item) => item !== value);
    setFormData((prevData) => ({
      ...prevData,
      [field]: updatedValues,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchCountriesData()).unwrap();
      } catch (error) {
        console.error("Error fetching countries data", error);
      }
    };
    if (countries.length === 0) {
      fetchData();
    }
  }, [dispatch]); // Adding dispatch as a dependency (best practice)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-auto max-h-[80vh] p-5">
        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>
          <DialogClose asChild>
            <button className="absolute right-4 top-4">
              <RiCloseLine size={24} />
            </button>
          </DialogClose>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(e);
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-8">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                type="text"
                id="jobTitle"
                name="jobTitle"
                placeholder="Enter job title"
                value={formData.jobTitle}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div className="mb-8">
              <Label htmlFor="sector">Sector</Label>
              <select
                id="sector"
                name="sector"
                value={formData.sector}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value="">Select Sector</option>
                {sectors.map((sector) => (
                  <option key={sector.value} value={sector.name}>
                    {sector.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-8">
              <Label htmlFor="skillsRequired">Skills Required</Label>
              <div className="relative">
                <DropdownMenu
                  open={isSkillsDropdownOpen}
                  onOpenChange={setIsSkillsDropdownOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setIsSkillsDropdownOpen(!isSkillsDropdownOpen)
                      }
                      className="w-full justify-between"
                    >
                      Select Skills
                      <RiArrowDropDownLine
                        size={25}
                        className="absolute right-0"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full max-h-80 overflow-y-auto">
                    {skills.length > 0 ? (
                      skills.map((skill) => (
                        <DropdownMenuCheckboxItem
                          key={skill._id}
                          checked={formData.skillsRequired.includes(skill.name)}
                          onCheckedChange={(checked) =>
                            handleMultiSelectChange(
                              {
                                target: { value: skill.name, checked },
                              } as React.ChangeEvent<HTMLInputElement>,
                              "skillsRequired"
                            )
                          }
                        >
                          {skill.name}
                        </DropdownMenuCheckboxItem>
                      ))
                    ) : (
                      <p>No skills available</p>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex gap-2 flex-wrap mt-2">
                {formData.skillsRequired.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-2 bg-gray-200 rounded p-1"
                  >
                    <span>{skill}</span>
                    <RiCloseLine
                      className="text-red-500 cursor-pointer"
                      size={16}
                      onClick={() =>
                        handleMultiSelectChange(
                          {
                            target: { value: skill, checked: false },
                          } as React.ChangeEvent<HTMLInputElement>,
                          "skillsRequired"
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <Label htmlFor="country">Country</Label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value="">Select</option>
                {/* {Country.getAllCountries().map((country) => (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </option>
                ))} */}
                {countrieslist.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-8">
              <Label htmlFor="province">State/Province</Label>
              <select
                id="province"
                name="province"
                value={formData.province}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value="">Select</option>
                {/* {State.getStatesOfCountry(formData.country).map((state) => (
                  <option key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </option>
                ))} */}
                {provinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-8">
              <Label htmlFor="city">City</Label>
              <select
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value="">Select</option>
                {/* {City.getCitiesOfState(formData.country, formData.province).map(
                  (city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  )
                )} */}
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-8">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter job description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border rounded p-2"
                rows={4}
              />
            </div>
          </div>

          <div className="mb-8">
            <Label htmlFor="benefits">Benefits (Optional)</Label>
            <div className="relative">
              <DropdownMenu
                open={isBenefitsDropdownOpen}
                onOpenChange={setIsBenefitsDropdownOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setIsBenefitsDropdownOpen(!isBenefitsDropdownOpen)
                    }
                    className="w-full justify-between"
                  >
                    Select Benefits
                    <RiArrowDropDownLine
                      size={25}
                      className="absolute right-0"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full max-h-80 overflow-y-auto">
                  {/* {benefits.map((benefit) => (
                    <DropdownMenuCheckboxItem
                      key={benefit.value}
                      checked={selectedBenefits.includes(benefit)}
                      onCheckedChange={() => handleBenefitToggle(benefit)}
                    >
                      {benefit}
                    </DropdownMenuCheckboxItem>
                  ))} */}
                  {benefits.map((benefit) => (
                    <DropdownMenuCheckboxItem
                      key={benefit._id}
                      checked={selectedBenefits.includes(benefit.name)}
                      onCheckedChange={() => handleBenefitToggle(benefit.name)}
                    >
                      {benefit.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex gap-2 flex-wrap mt-2">
              {selectedBenefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-2 bg-gray-200 rounded p-1"
                >
                  <span>{benefit}</span>
                  <RiCloseLine
                    className="text-red-500 cursor-pointer"
                    size={16}
                    onClick={() => handleDeleteBenefit(benefit)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <Label htmlFor="salaryFrom">Salary Indication</Label>
            <Input
              type="text"
              id="salaryFrom"
              name="salaryFrom"
              placeholder="Enter minimum salary"
              value={formData.salaryFrom}
              onChange={handleChange}
              className="w-full border mb-2 rounded p-2"
            />
            <Input
              type="text"
              id="salaryTo"
              name="salaryTo"
              placeholder="Enter maximum salary"
              value={formData.salaryTo}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          <div className="mb-8">
            <Label>Level of Urgency</Label>
            <div className="flex border justify-around items-center p-2 bg-background gap-2">
              {["High", "Medium", "Low"].map((level) => (
                <label key={level} className="flex items-center">
                  <input
                    type="radio"
                    name="urgency"
                    value={level}
                    checked={formData.urgency === level}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  {level}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <Label>Career Level</Label>
            <div className="flex border justify-around items-center p-2 bg-background gap-2">
              {["entry", "middle", "senior", "executive"].map((level) => (
                <label key={level} className="flex items-center">
                  <input
                    type="radio"
                    name="careerLevel"
                    value={level}
                    checked={formData.careerLevel === level}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  {level}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <Label>Job Type</Label>
            <div className="flex border justify-around items-center p-2 bg-background gap-2">
              {["full-time", "part-time"].map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="radio"
                    name="jobType"
                    value={type}
                    checked={formData.jobType === type}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <Label>Candidate Type</Label>
            <div className="flex border justify-around items-center p-2 bg-background gap-2">
              {["remote", "contractual", "internship", "foreigner"].map(
                (type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="radio"
                      name="candidateType"
                      value={type}
                      checked={formData.candidateType === type}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {type}
                  </label>
                )
              )}
            </div>
          </div>

          {/* <div className="mb-8 flex items-center">
            <Checkbox
              id="workPermitNeeded"
              name="workPermitNeeded"
              checked={formData.workPermitNeeded}
              onChange={(e) =>
                handleChange(e as React.ChangeEvent<HTMLInputElement>)
              }
              className="mr-2"
            />
            <Label htmlFor="workPermitNeeded">Work Permit Needed</Label>
          </div> */}

          <div className=" ">
            <Button
              type="submit"
              className="w-full bg-signature text-background py-3"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditJobDialog;
