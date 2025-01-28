"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  fetchSkills,
  Skill,
  fetchSectors,
  fetchBenefits,
} from "@/store/slices/profileSlices";
import { RootState, AppDispatch } from "@/store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RiArrowDropDownLine, RiCloseLine } from "react-icons/ri";
import {
  Country,
  State,
  City,
  ICountry,
  IState,
  ICity,
} from "country-state-city";
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

interface FormLeftSideProps {
  formData: FormStateData;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleMultiSelectChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof FormStateData
  ) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormStateData>>;
}

const FormLeftSide: React.FC<FormLeftSideProps> = ({
  formData,
  handleChange,
  handleMultiSelectChange,
  setFormData,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { skills, sectors } = useSelector((state: RootState) => state.profile);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { countries } = useSelector((state: RootState) => state.postJob);

  // Destructure cities, provinces, and countries with unique values
  const cities = [...new Set(countries.map((location) => location.city))];
  const provinces = [
    ...new Set(countries.map((location) => location.province)),
  ];
  const countrieslist = [
    ...new Set(countries.map((location) => location.country)),
  ];

  console.log({ cities, provinces, countrieslist });

  // // // States for country, province (state), and city
  // const [countries] = useState<ICountry[]>(Country.getAllCountries());
  // const [states, setStates] = useState<IState[]>([]);
  // const [cities, setCities] = useState<ICity[]>([]);

  useEffect(() => {
    dispatch(fetchSkills());
    dispatch(fetchSectors());
  }, [dispatch]);

  useEffect(() => {
    if (skills.length > 0) {
      const initialSelectedSkills = formData.skillsRequired
        .map((skillName) => skills.find((skill) => skill.name === skillName))
        .filter((skill): skill is Skill => skill !== undefined);
      setSelectedSkills(initialSelectedSkills);
    }
  }, [skills, formData.skillsRequired]);

  const handleSkillToggle = (skill: Skill) => {
    const updatedSelectedSkills = selectedSkills.some(
      (s) => s._id === skill._id
    )
      ? selectedSkills.filter((s) => s._id !== skill._id)
      : [...selectedSkills, skill];

    setSelectedSkills(updatedSelectedSkills);
    setFormData((prevData) => ({
      ...prevData,
      skillsRequired: updatedSelectedSkills.map((s) => s.name),
    }));
  };

  const handleDelete = (skillName: string) => {
    const updatedSkills = selectedSkills.filter((s) => s.name !== skillName);
    setSelectedSkills(updatedSkills);
    setFormData((prevData) => ({
      ...prevData,
      skillsRequired: updatedSkills.map((s) => s.name),
    }));
  };

  // const handleCountryChange = (countryCode: string) => {
  //   setStates(State.getStatesOfCountry(countryCode));
  //   setCities([]);
  //   handleChange({
  //     target: { name: "country", value: countryCode } as HTMLSelectElement,
  //     currentTarget: {} as HTMLSelectElement,
  //   } as React.ChangeEvent<HTMLSelectElement>);
  //   handleChange({
  //     target: { name: "province", value: "" } as HTMLSelectElement,
  //     currentTarget: {} as HTMLSelectElement,
  //   } as React.ChangeEvent<HTMLSelectElement>);
  //   handleChange({
  //     target: { name: "city", value: "" } as HTMLSelectElement,
  //     currentTarget: {} as HTMLSelectElement,
  //   } as React.ChangeEvent<HTMLSelectElement>);
  // };

  // const handleStateChange = (stateCode: string) => {
  //   setCities(City.getCitiesOfState(formData.country, stateCode));
  //   handleChange({
  //     target: { name: "province", value: stateCode } as HTMLSelectElement,
  //     currentTarget: {} as HTMLSelectElement,
  //   } as React.ChangeEvent<HTMLSelectElement>);
  //   handleChange({
  //     target: { name: "city", value: "" } as HTMLSelectElement,
  //     currentTarget: {} as HTMLSelectElement,
  //   } as React.ChangeEvent<HTMLSelectElement>);
  // };

  // const handleCityChange = (cityName: string) => {
  //   handleChange({
  //     target: { name: "city", value: cityName } as HTMLSelectElement,
  //     currentTarget: {} as HTMLSelectElement,
  //   } as React.ChangeEvent<HTMLSelectElement>);
  // };

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
  }, [dispatch]);

  return (
    <div>
      <div className="mb-8">
        <Label htmlFor="jobTitle">Job Title</Label>
        <Input
          type="text"
          id="jobTitle"
          name="jobTitle"
          placeholder="Enter job title"
          value={formData.jobTitle}
          onChange={handleChange}
          className="w-full bg-background"
        />
      </div>

      <div className="mb-8">
        <Label htmlFor="sector">Sector</Label>
        <select
          id="sector"
          name="sector"
          value={formData.sector}
          onChange={handleChange}
          className="w-full border bg-background rounded p-2"
        >
          {/* <option value="">Select</option>
          <option value="IT">IT</option>
          <option value="Finance">Finance</option>
          <option value="Healthcare">Healthcare</option> */}

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
        <div className="relative bg-background ">
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full justify-between"
              >
                Select Skills
                <RiArrowDropDownLine size={25} className="absolute right-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full max-h-80 overflow-y-auto">
              <DropdownMenuLabel>Skills</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {skills.map((skill) => (
                <DropdownMenuCheckboxItem
                  key={skill._id}
                  checked={selectedSkills.some((s) => s._id === skill._id)}
                  onCheckedChange={() => handleSkillToggle(skill)}
                >
                  {skill.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex gap-2 flex-wrap mt-2">
          {selectedSkills.map((skill) => (
            <div
              key={skill._id}
              className="flex items-center gap-2 bg-mutedLight rounded p-1"
            >
              <span>{skill.name}</span>
              <RiCloseLine
                className="text-red-500 cursor-pointer"
                size={16}
                onClick={() => handleDelete(skill.name)}
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
          // onChange={(e) => handleCountryChange(e.target.value)}
          className="w-full border bg-background  rounded p-2"
        >
          <option value="">Select</option>
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
          // onChange={(e) => handleStateChange(e.target.value)}
          className="w-full border bg-background  rounded p-2"
          // disabled={!states.length}
        >
          <option value="">Select</option>
          {/* {states.map((state) => (
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
          // onChange={(e) => handleCityChange(e.target.value)}
          className="w-full bg-background  border rounded p-2"
          disabled={!cities.length}
        >
          <option value="">Select</option>
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
          className="w-full border bg-background  rounded p-2"
          rows={4}
        />
      </div>
    </div>
  );
};

export default FormLeftSide;
