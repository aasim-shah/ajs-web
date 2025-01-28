"use client";
import React, { Dispatch, FC, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Country,
  State,
  City,
  ICountry,
  IState,
  ICity,
} from "country-state-city";
import { CompanyFormData } from "./MultiStepForm";
import PaymentPlan from "./paymentPlan/PaymentPlan";

interface StepProps {
  formData: CompanyFormData;
  setFormData: Dispatch<React.SetStateAction<CompanyFormData>>;
  nextStep: () => void;
  prevStep: () => void;
  submitForm: () => void;
  errors: { [key: string]: string };
}

const Step2: FC<StepProps> = ({
  formData,
  setFormData,
  nextStep,
  prevStep,
  errors,
}) => {
  const thailand: ICountry = Country.getCountryByCode("TH")!;
  const [states, setStates] = useState<IState[]>(
    State.getStatesOfCountry(thailand.isoCode)
  );
  const [cities, setCities] = useState<ICity[]>([]);

  useEffect(() => {
    if (!formData.country) {
      setFormData((prev) => ({ ...prev, country: thailand.name }));
    }

    if (formData.province) {
      const selectedState = states.find(
        (state) => state.name === formData.province
      );
      if (selectedState) {
        const citiesInState = City.getCitiesOfState(
          thailand.isoCode,
          selectedState.isoCode
        );
        setCities(citiesInState);
      }
    }
  }, [formData.province, formData.country, states, setFormData]);

  const handleStateChange = (stateName: string) => {
    const selectedState = states.find((state) => state.name === stateName);
    setFormData((prev) => ({
      ...prev,
      province: selectedState ? selectedState.name : "",
      city: "", // Reset city when province changes
    }));
    if (selectedState) {
      setCities(City.getCitiesOfState(thailand.isoCode, selectedState.isoCode));
    }
  };

  const handleCityChange = (cityName: string) => {
    setFormData((prev) => ({
      ...prev,
      city: cityName,
    }));
  };

  return (
    <>
      <div className="max-w-3xl border rounded-lg mx-auto p-4">
        <h2 className="text-3xl text-custom-dark-blue text-center font-bold my-10">
          Contact Details
        </h2>

        <div className="grid w-full items-center gap-1.5 mb-10">
          <Label className="text-custom-dark-blue" htmlFor="websiteUrl">
            Website URL
          </Label>
          <Input
            type="text"
            id="websiteUrl"
            placeholder="Enter website URL"
            value={formData.websiteUrl}
            onChange={(e) =>
              setFormData({ ...formData, websiteUrl: e.target.value })
            }
            className="w-full"
          />
          {errors.websiteUrl && (
            <p className="text-red-500">{errors.websiteUrl}</p>
          )}
        </div>

        <div className="grid w-full items-center gap-1.5 mb-10">
          <Label className="text-custom-dark-blue" htmlFor="email">
            Email Address
          </Label>
          <Input
            type="email"
            id="email"
            placeholder="Enter email address"
            value={formData.email}
            disabled
            className="w-full"
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>

        {/* Country Select (locked to Thailand, storing full name) */}
        <div className="grid w-full items-center gap-1.5 mb-10">
          <Label className="text-custom-dark-blue" htmlFor="country">
            Country
          </Label>
          <Select
            value={formData.country}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, country: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue>{thailand.name}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={thailand.name}>{thailand.name}</SelectItem>
            </SelectContent>
          </Select>
          {errors.country && <p className="text-red-500">{errors.country}</p>}
        </div>

        {/* Province Select (storing full name) */}
        <div className="grid w-full items-center gap-1.5 mb-10">
          <Label className="text-custom-dark-blue" htmlFor="province">
            Province
          </Label>
          <Select
            onValueChange={handleStateChange}
            value={formData.province || ""}
            disabled={!states.length}
          >
            <SelectTrigger id="province" className="w-full">
              <SelectValue placeholder="Select Province">
                {formData.province || "Select Province"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state.isoCode} value={state.name}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.province && <p className="text-red-500">{errors.province}</p>}
        </div>

        {/* City Select (storing full name) */}
        <div className="grid w-full items-center gap-1.5 mb-10">
          <Label className="text-custom-dark-blue" htmlFor="city">
            City
          </Label>
          <Select
            onValueChange={handleCityChange}
            value={formData.city || ""}
            disabled={!cities.length}
          >
            <SelectTrigger id="city" className="w-full">
              <SelectValue placeholder="Select City">
                {formData.city || "Select City"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city.name} value={city.name}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.city && <p className="text-red-500">{errors.city}</p>}
        </div>

        <div className="grid w-full items-center gap-1.5 mb-10">
          <Label className="text-custom-dark-blue" htmlFor="address">
            Address
          </Label>
          <Input
            type="text"
            id="address"
            placeholder="Enter address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className="w-full"
          />
          {errors.address && <p className="text-red-500">{errors.address}</p>}
        </div>

        <div className="flex justify-between gap-5">
          <Button onClick={prevStep} variant={"secondary"} className="w-1/4">
            Back
          </Button>
          <Button onClick={nextStep} className="bg-signature w-3/4">
            Continue
          </Button>
        </div>
      </div>

      {/* <div>
        <PaymentPlan />
      </div> */}
    </>
  );
};

export default Step2;
