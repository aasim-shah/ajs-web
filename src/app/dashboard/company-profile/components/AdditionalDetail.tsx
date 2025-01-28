import React, { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import { TbLanguage } from "react-icons/tb";
import CreatableSelect from "react-select/creatable";
import ISO6391 from "iso-639-1";
import {
  Country,
  State,
  City,
  ICountry,
  IState,
  ICity,
} from "country-state-city";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AdditionalDetailProps {
  email: string;
  address: string;
  country: string;
  province: string;
  city: string;
  languages: string[];
  onUpdate: (
    updates: Partial<{
      email: string;
      address: string;
      country: string;
      province: string;
      city: string;
      languages: string[];
    }>
  ) => Promise<void>;
}

const AdditionalDetail: React.FC<AdditionalDetailProps> = ({
  email,
  address,
  country,
  province,
  city,
  languages,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: email || "",
    address: address || "",
    country: country || "",
    province: province || "",
    city: city || "",
    languages: languages || [],
  });

  const [countries] = useState<ICountry[]>(Country.getAllCountries());
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  // Synchronize formData with the props
  useEffect(() => {
    setFormData({
      email: email || "",
      address: address || "",
      country: country || "",
      province: province || "",
      city: city || "",
      languages: languages || [],
    });
  }, [email, address, country, province, city, languages]);

  useEffect(() => {
    if (formData.country) {
      setStates(State.getStatesOfCountry(formData.country));
      if (formData.province) {
        setCities(City.getCitiesOfState(formData.country, formData.province));
      }
    }
  }, [formData.country, formData.province]);

  const handleCountryChange = (countryCode: string) => {
    setFormData((prev) => ({
      ...prev,
      country: countryCode,
      province: "",
      city: "",
    }));
    setStates(State.getStatesOfCountry(countryCode));
    setCities([]);
  };

  const handleStateChange = (stateCode: string) => {
    setFormData((prev) => ({
      ...prev,
      province: stateCode,
      city: "",
    }));
    setCities(City.getCitiesOfState(formData.country, stateCode));
  };

  const handleCityChange = (cityName: string) => {
    setFormData((prev) => ({
      ...prev,
      city: cityName,
    }));
  };

  const handleSave = async () => {
    console.log({ formData });
    await onUpdate({
      email: formData.email,
      // address: `${formData.address}, ${formData.city}, ${formData.province}, ${formData.country}`,
      address: formData.address,
      // country: formData.country,
      country: Country.getCountryByCode(formData.country)?.name || "",
      province: State.getStateByCode(formData.province)?.name || "",
      city: formData.city,
      languages: formData.languages,
    });
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLanguageChange = (selectedOptions: any) => {
    setFormData((prevData) => ({
      ...prevData,
      languages: selectedOptions
        ? selectedOptions.map((option: any) => option.value)
        : [],
    }));
  };

  const languageOptions = ISO6391.getAllNames().map((name) => ({
    label: name,
    value: name,
  }));

  return (
    <div className="border rounded-[20px] py-2 sm:py-6 px-2 sm:px-5">
      <div className="flex justify-between">
        <h1 className="text-modaltext md:text-2xl">Additional Details</h1>
        <button onClick={() => setIsEditing(true)}>
          <FaRegEdit
            className="text-signature border rounded-lg p-2 cursor-pointer"
            size={40}
          />
        </button>
      </div>

      <div className="sm:py-8 py-3">
        <div className="flex gap-5">
          <div>
            <MdOutlineMailOutline className="text-signininput4" size={30} />
          </div>
          <div>
            <h1 className="sm:text-lg text-signininput4">Email</h1>
            <p className="sm:text-lg text-modaltext">{formData.email}</p>
          </div>
        </div>
        <div className="py-8">
          <div className="flex gap-5">
            <div>
              <FaMapMarkerAlt className="text-signininput4" size={30} />
            </div>
            <div>
              <h1 className="sm:text-lg text-signininput4">Address</h1>
              <p className="sm:text-lg text-modaltext">
                {formData.address} , {formData.city}, {formData.province},{" "}
                {formData.country}
              </p>
            </div>
          </div>
        </div>
        <div>
          <div className="flex gap-5">
            <div>
              <TbLanguage className="text-signininput4" size={30} />
            </div>
            <div>
              <h1 className="sm:text-lg text-signininput4">Languages</h1>
              <p className="sm:text-lg text-modaltext">
                {formData.languages.join(", ")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[600px] p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Edit Additional Details
            </DialogTitle>
            <DialogDescription className="text-md text-gray-500">
              Make changes to your additional details here. Click save when you
              are done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="country" className="text-right">
                Country
              </Label>
              <select
                id="country"
                value={formData.country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="col-span-3 p-2 border rounded"
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="state" className="text-right">
                State
              </Label>
              <select
                id="state"
                value={formData.province}
                onChange={(e) => handleStateChange(e.target.value)}
                className="col-span-3 p-2 border rounded max-h-32 overflow-y-auto"
                disabled={!states.length}
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="city" className="text-right">
                City
              </Label>
              <select
                id="city"
                value={formData.city}
                onChange={(e) => handleCityChange(e.target.value)}
                className="col-span-3 p-2 border rounded max-h-32 overflow-y-auto"
                disabled={!cities.length}
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* make here a div for address with an input field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter Address"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="languages" className="text-right">
                Languages
              </Label>
              <CreatableSelect
                id="languages"
                isMulti
                options={languageOptions}
                value={formData.languages.map((lang) => ({
                  label: lang,
                  value: lang,
                }))}
                onChange={handleLanguageChange}
                className="col-span-3"
                placeholder="Type and press enter to add new language"
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
  );
};

export default AdditionalDetail;
