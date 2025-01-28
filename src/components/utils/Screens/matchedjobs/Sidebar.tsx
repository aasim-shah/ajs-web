import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Checkbox from '../../../repeatComponents/Checkbox';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { GoSidebarCollapse } from 'react-icons/go';
import { RootState, AppDispatch } from '@/store';
import { addJobPreference, updateJobPreference, fetchSectors } from '@/store/slices/jobPreferenceSlice';
import { Country, State, City, ICountry, IState, ICity } from 'country-state-city';


interface JobPreference {
  sectors: string[];
  salary?: {
    from: number;
    to?: number;
  };
  availability?: string;
  careerLevel?: string;
  jobType?: string;
  candidateType?: string;
  locations: {
    city?: string;
    province?: string;
    country?: string;
  }[];
}


interface SidebarProps {
  onCheckboxChange: (filter: string) => void;
  selectedFilters: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ onCheckboxChange, selectedFilters }) => {
  const dispatch = useDispatch<AppDispatch>();
  const jobPreferences = useSelector((state: RootState) => state.jobPreferences.preferences);
  const sectors = useSelector((state: RootState) => state.jobPreferences.sectors);

  const [countries] = useState<ICountry[]>(Country.getAllCountries());
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [fromSalary, setFromSalary] = useState('');
  const [toSalary, setToSalary] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCareerLevel, setSelectedCareerLevel] = useState<string[]>([]);
  const [selectedCandidateType, setSelectedCandidateType] = useState<string[]>([]);

  useEffect(() => {
    if (jobPreferences) {
      setSelectedCountry(jobPreferences.locations && jobPreferences.locations[0]?.country || '');
      setSelectedState(jobPreferences.locations && jobPreferences.locations[0]?.province || '');
      setSelectedCity(jobPreferences.locations && jobPreferences.locations[0]?.city || '');
      setSelectedSectors(jobPreferences.sectors || []);
      setFromSalary(jobPreferences.salary?.from?.toString() || '');
      setToSalary(jobPreferences.salary?.to?.toString() || '');
      setSelectedCareerLevel(jobPreferences.careerLevel ? [jobPreferences.careerLevel] : []);
      setSelectedCandidateType(jobPreferences.candidateType ? [jobPreferences.candidateType] : []);
    }
  }, [jobPreferences]);
  
  
  

  useEffect(() => {
    if (selectedCountry) {
      setStates(State.getStatesOfCountry(selectedCountry));
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      setCities(City.getCitiesOfState(selectedCountry, selectedState));
    }
  }, [selectedCountry, selectedState]);

  useEffect(() => {
    dispatch(fetchSectors());
  }, [dispatch]);

  const handlePreferenceChange = (preferenceType: string, value: any) => {
    let updatedPreferences: JobPreference = {
      ...jobPreferences,
      sectors: jobPreferences?.sectors ?? [],
      locations: jobPreferences?.locations ?? [],
    };

    switch (preferenceType) {
      case 'sectors':
        updatedPreferences.sectors = value || [];
        setSelectedSectors(value);
        break;
      case 'availability':
        updatedPreferences.availability = value;
        break;
      case 'careerLevel':
        updatedPreferences.careerLevel = value;
        setSelectedCareerLevel([value]);
        break;
      case 'jobType':
        updatedPreferences.jobType = value;
        break;
      case 'candidateType':
        updatedPreferences.candidateType = value;
        setSelectedCandidateType([value]);
        break;
      case 'location':
        updatedPreferences.locations = [{ city: selectedCity, province: selectedState, country: selectedCountry }];
        break;
      case 'salary':
        updatedPreferences.salary = {
          from: fromSalary ? parseInt(fromSalary) : 0,
          to: toSalary ? parseInt(toSalary) : undefined,
        };
        break;
      default:
        break;
    }

    dispatch(updateJobPreference(updatedPreferences));
  };

  const handleCheckboxChange = (type: string, value: string) => {
    if (type === 'careerLevel') {
      setSelectedCareerLevel([value]);
      handlePreferenceChange(type, value);
    } else if (type === 'candidateType') {
      setSelectedCandidateType([value]);
      handlePreferenceChange(type, value);
    }
  };

  const handleSectorToggle = (sectorValue: string) => {
    let updatedSectors;
    if (selectedSectors.includes(sectorValue)) {
      updatedSectors = selectedSectors.filter((sector) => sector !== sectorValue);
    } else {
      updatedSectors = [...selectedSectors, sectorValue];
    }
    handlePreferenceChange('sectors', updatedSectors);
  };

  const filteredSectors = sectors.filter((sector) =>
    sector.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Desktop View */}
      <div className="md:w-1/4 md:block hidden">
        <div>
          <h2 className="lg:text-xl md:text-lg text-md font-bold">Job Preferences</h2>
        </div>
        <div className="bg-mutedLight rounded-xl p-4">
          <Accordion type="single" collapsible className="w-full">
            {/* Availability */}
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-base">Availability</AccordionTrigger>
              <AccordionContent>
                <Checkbox
                  id="immediate"
                  checked={selectedFilters.includes("immediate")}
                  onChange={() => {
                    onCheckboxChange("immediate");
                    handlePreferenceChange("availability", "immediate");
                  }}
                >
                  Immediate
                </Checkbox>
                <Checkbox
                  id="within-a-week"
                  checked={selectedFilters.includes("within-a-week")}
                  onChange={() => {
                    onCheckboxChange("within-a-week");
                    handlePreferenceChange("availability", "within-a-week");
                  }}
                >
                  Within a Week
                </Checkbox>
                <Checkbox
                  id="within-a-month"
                  checked={selectedFilters.includes("within-a-month")}
                  onChange={() => {
                    onCheckboxChange("within-a-month");
                    handlePreferenceChange("availability", "within-a-month");
                  }}
                >
                  Within a Month
                </Checkbox>
              </AccordionContent>
            </AccordionItem>

            {/* Job Type */}
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-base">Job Type</AccordionTrigger>
              <AccordionContent>
                <Checkbox
                  id="full-time"
                  checked={selectedFilters.includes("full-time")}
                  onChange={() => {
                    onCheckboxChange("full-time");
                    handlePreferenceChange("jobType", "full-time");
                  }}
                >
                  Full-Time
                </Checkbox>
                <Checkbox
                  id="part-time"
                  checked={selectedFilters.includes("part-time")}
                  onChange={() => {
                    onCheckboxChange("part-time");
                    handlePreferenceChange("jobType", "part-time");
                  }}
                >
                  Part-Time
                </Checkbox>
              </AccordionContent>
            </AccordionItem>

            {/* Career Level */}
            <AccordionItem value="item-6">
              <AccordionTrigger className="text-base">Career Level</AccordionTrigger>
              <AccordionContent>
                <Checkbox
                  id="entry-level"
                  checked={selectedCareerLevel.includes("entry")}
                  onChange={() => handleCheckboxChange("careerLevel", "entry")}
                >
                  Entry Level
                </Checkbox>
                <Checkbox
                  id="mid-level"
                  checked={selectedCareerLevel.includes("mid")}
                  onChange={() => handleCheckboxChange("careerLevel", "mid")}
                >
                  Mid Level
                </Checkbox>
                <Checkbox
                  id="senior-level"
                  checked={selectedCareerLevel.includes("senior")}
                  onChange={() => handleCheckboxChange("careerLevel", "senior")}
                >
                  Senior Level
                </Checkbox>
                <Checkbox
                  id="manager-level"
                  checked={selectedCareerLevel.includes("manager")}
                  onChange={() => handleCheckboxChange("careerLevel", "manager")}
                >
                  Manager Level
                </Checkbox>
                <Checkbox
                  id="executive-level"
                  checked={selectedCareerLevel.includes("executive")}
                  onChange={() => handleCheckboxChange("careerLevel", "executive")}
                >
                  Executive Level
                </Checkbox>
              </AccordionContent>
            </AccordionItem>

            {/* Candidate Type */}
            <AccordionItem value="item-7">
              <AccordionTrigger className="text-base">Candidate Type</AccordionTrigger>
              <AccordionContent>
                <Checkbox
                  id="intern"
                  checked={selectedCandidateType.includes("intern")}
                  onChange={() => handleCheckboxChange("candidateType", "intern")}
                >
                  Intern
                </Checkbox>
                <Checkbox
                  id="contractor"
                  checked={selectedCandidateType.includes("contractor")}
                  onChange={() => handleCheckboxChange("candidateType", "contractor")}
                >
                  Contractor
                </Checkbox>
                <Checkbox
                  id="permanent"
                  checked={selectedCandidateType.includes("permanent")}
                  onChange={() => handleCheckboxChange("candidateType", "permanent")}
                >
                  Permanent
                </Checkbox>
              </AccordionContent>
            </AccordionItem>

            {/* Sectors */}
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-base">Sector</AccordionTrigger>
              <AccordionContent>
                <div>
                  <div className="mb-2">
                    <h4 className="text-sm font-medium">Selected Sectors:</h4>
                    {selectedSectors.length > 0 ? (
                      <ul className="list-disc pl-5 mt-1">
                        {selectedSectors.map((sectorValue) => {
                          const sector = sectors.find((s) => s.value === sectorValue);
                          return (
                            <li key={sectorValue} className="text-sm">
                              {sector?.name}
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="text-sm italic">No sectors selected</p>
                    )}
                  </div>
                  <label htmlFor="sector-search" className="block text-sm font-medium text-gray-700">Search Sector</label>
                  <input
                    type="text"
                    id="sector-search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-1 block w-full p-2 border rounded"
                    placeholder="Search sector..."
                  />
                  <div className="mt-2 max-h-40 overflow-y-auto">
                    {filteredSectors.map((sector) => (
                      <div key={sector._id} className="flex items-center">
                        <Checkbox
                          id={`sector-${sector.value}`}
                          checked={selectedSectors.includes(sector.value)}
                          onChange={() => handleSectorToggle(sector.value)}
                        >
                          {sector.name}
                        </Checkbox>
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Salary Range */}
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-base">Salary Range</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-4 items-center">
                  <div>
                    <label htmlFor="from-salary" className="block text-sm font-medium text-gray-700">From</label>
                    <select
                      id="from-salary"
                      value={fromSalary}
                      onChange={(e) => setFromSalary(e.target.value)}
                      className="mt-1 block w-full p-2 border rounded"
                    >
                      <option value="">From</option>
                      {Array.from({ length: 100 }, (_, i) => (i + 1) * 500).map((salary) => (
                        <option key={salary} value={salary.toString()}>
                          ${salary}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="to-salary" className="block text-sm font-medium text-gray-700">To</label>
                    <select
                      id="to-salary"
                      value={toSalary}
                      onChange={(e) => setToSalary(e.target.value)}
                      className="mt-1 block w-full p-2 border rounded"
                    >
                      <option value="">To</option>
                      {Array.from({ length: 100 }, (_, i) => (i + 1) * 500).map((salary) => (
                        <option key={salary} value={salary.toString()}>
                          ${salary}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Location */}
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-base">Location</AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4">
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                    <select
                      id="country"
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="mt-1 block w-full p-2 border rounded"
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country.isoCode} value={country.isoCode}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                    <select
                      id="state"
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="mt-1 block w-full p-2 border rounded"
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
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                    <select
                      id="city"
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="mt-1 block w-full p-2 border rounded"
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
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden block">
        <Sheet>
          <SheetTrigger>
            <GoSidebarCollapse size={30} />
          </SheetTrigger>
          <SheetContent className="w-full">
            <div className="bg-muted rounded-lg p-4">
              <Accordion type="single" collapsible className="w-full">
                {/* Similar Mobile Structure */}
                {/* Availability */}
                <AccordionItem value="mobile-item-1">
                  <AccordionTrigger className="text-base">Availability</AccordionTrigger>
                  <AccordionContent>
                    <Checkbox
                      id="mobile-immediate"
                      checked={selectedFilters.includes("immediate")}
                      onChange={() => {
                        onCheckboxChange("immediate");
                        handlePreferenceChange("availability", "immediate");
                      }}
                    >
                      Immediate
                    </Checkbox>
                    <Checkbox
                      id="mobile-within-a-week"
                      checked={selectedFilters.includes("within-a-week")}
                      onChange={() => {
                        onCheckboxChange("within-a-week");
                        handlePreferenceChange("availability", "within-a-week");
                      }}
                    >
                      Within a Week
                    </Checkbox>
                    <Checkbox
                      id="mobile-within-a-month"
                      checked={selectedFilters.includes("within-a-month")}
                      onChange={() => {
                        onCheckboxChange("within-a-month");
                        handlePreferenceChange("availability", "within-a-month");
                      }}
                    >
                      Within a Month
                    </Checkbox>
                  </AccordionContent>
                </AccordionItem>

                {/* Job Type */}
                <AccordionItem value="mobile-item-2">
                  <AccordionTrigger className="text-base">Job Type</AccordionTrigger>
                  <AccordionContent>
                    <Checkbox
                      id="mobile-full-time"
                      checked={selectedFilters.includes("full-time")}
                      onChange={() => {
                        onCheckboxChange("full-time");
                        handlePreferenceChange("jobType", "full-time");
                      }}
                    >
                      Full-Time
                    </Checkbox>
                    <Checkbox
                      id="mobile-part-time"
                      checked={selectedFilters.includes("part-time")}
                      onChange={() => {
                        onCheckboxChange("part-time");
                        handlePreferenceChange("jobType", "part-time");
                      }}
                    >
                      Part-Time
                    </Checkbox>
                  </AccordionContent>
                </AccordionItem>

                {/* Career Level */}
                <AccordionItem value="mobile-item-6">
                  <AccordionTrigger className="text-base">Career Level</AccordionTrigger>
                  <AccordionContent>
                    <Checkbox
                      id="mobile-entry-level"
                      checked={selectedCareerLevel.includes("entry")}
                      onChange={() => handleCheckboxChange("careerLevel", "entry")}
                    >
                      Entry Level
                    </Checkbox>
                    <Checkbox
                      id="mobile-mid-level"
                      checked={selectedCareerLevel.includes("mid")}
                      onChange={() => handleCheckboxChange("careerLevel", "mid")}
                    >
                      Mid Level
                    </Checkbox>
                    <Checkbox
                      id="mobile-senior-level"
                      checked={selectedCareerLevel.includes("senior")}
                      onChange={() => handleCheckboxChange("careerLevel", "senior")}
                    >
                      Senior Level
                    </Checkbox>
                    <Checkbox
                      id="mobile-manager-level"
                      checked={selectedCareerLevel.includes("manager")}
                      onChange={() => handleCheckboxChange("careerLevel", "manager")}
                    >
                      Manager Level
                    </Checkbox>
                    <Checkbox
                      id="mobile-executive-level"
                      checked={selectedCareerLevel.includes("executive")}
                      onChange={() => handleCheckboxChange("careerLevel", "executive")}
                    >
                      Executive Level
                    </Checkbox>
                  </AccordionContent>
                </AccordionItem>

                {/* Candidate Type */}
                <AccordionItem value="mobile-item-7">
                  <AccordionTrigger className="text-base">Candidate Type</AccordionTrigger>
                  <AccordionContent>
                    <Checkbox
                      id="mobile-intern"
                      checked={selectedCandidateType.includes("intern")}
                      onChange={() => handleCheckboxChange("candidateType", "intern")}
                    >
                      Intern
                    </Checkbox>
                    <Checkbox
                      id="mobile-contractor"
                      checked={selectedCandidateType.includes("contractor")}
                      onChange={() => handleCheckboxChange("candidateType", "contractor")}
                    >
                      Contractor
                    </Checkbox>
                    <Checkbox
                      id="mobile-permanent"
                      checked={selectedCandidateType.includes("permanent")}
                      onChange={() => handleCheckboxChange("candidateType", "permanent")}
                    >
                      Permanent
                    </Checkbox>
                  </AccordionContent>
                </AccordionItem>

                {/* Sectors */}
                <AccordionItem value="mobile-item-3">
                  <AccordionTrigger className="text-base">Sector</AccordionTrigger>
                  <AccordionContent>
                    <div>
                      <div className="mb-2">
                        <h4 className="text-sm font-medium">Selected Sectors:</h4>
                        {selectedSectors.length > 0 ? (
                          <ul className="list-disc pl-5 mt-1">
                            {selectedSectors.map((sectorValue) => {
                              const sector = sectors.find((s) => s.value === sectorValue);
                              return (
                                <li key={sectorValue} className="text-sm">
                                  {sector?.name}
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <p className="text-sm italic">No sectors selected</p>
                        )}
                      </div>
                      <label htmlFor="mobile-sector-search" className="block text-sm font-medium text-gray-700">Search Sector</label>
                      <input
                        type="text"
                        id="mobile-sector-search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mt-1 block w-full p-2 border rounded"
                        placeholder="Search sector..."
                      />
                      <div className="mt-2 max-h-40 overflow-y-auto">
                        {filteredSectors.map((sector) => (
                          <div key={sector._id} className="flex items-center">
                            <Checkbox
                              id={`mobile-sector-${sector.value}`}
                              checked={selectedSectors.includes(sector.value)}
                              onChange={() => handleSectorToggle(sector.value)}
                            >
                              {sector.name}
                            </Checkbox>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Salary Range */}
                <AccordionItem value="mobile-item-4">
                  <AccordionTrigger className="text-base">Salary Range</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-4 items-center">
                      <div>
                        <label htmlFor="mobile-from-salary" className="block text-sm font-medium text-gray-700">From</label>
                        <select
                          id="mobile-from-salary"
                          value={fromSalary}
                          onChange={(e) => setFromSalary(e.target.value)}
                          className="mt-1 block w-full p-2 border rounded"
                        >
                          <option value="">From</option>
                          {Array.from({ length: 100 }, (_, i) => (i + 1) * 500).map((salary) => (
                            <option key={salary} value={salary.toString()}>
                              ${salary}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="mobile-to-salary" className="block text-sm font-medium text-gray-700">To</label>
                        <select
                          id="mobile-to-salary"
                          value={toSalary}
                          onChange={(e) => setToSalary(e.target.value)}
                          className="mt-1 block w-full p-2 border rounded"
                        >
                          <option value="">To</option>
                          {Array.from({ length: 100 }, (_, i) => (i + 1) * 500).map((salary) => (
                            <option key={salary} value={salary.toString()}>
                              ${salary}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Location */}
                <AccordionItem value="mobile-item-5">
                  <AccordionTrigger className="text-base">Location</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-4">
                      <div>
                        <label htmlFor="mobile-country" className="block text-sm font-medium text-gray-700">Country</label>
                        <select
                          id="mobile-country"
                          value={selectedCountry}
                          onChange={(e) => setSelectedCountry(e.target.value)}
                          className="mt-1 block w-full p-2 border rounded"
                        >
                          <option value="">Select Country</option>
                          {countries.map((country) => (
                            <option key={country.isoCode} value={country.isoCode}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="mobile-state" className="block text-sm font-medium text-gray-700">State</label>
                        <select
                          id="mobile-state"
                          value={selectedState}
                          onChange={(e) => setSelectedState(e.target.value)}
                          className="mt-1 block w-full p-2 border rounded"
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
                      <div>
                        <label htmlFor="mobile-city" className="block text-sm font-medium text-gray-700">City</label>
                        <select
                          id="mobile-city"
                          value={selectedCity}
                          onChange={(e) => setSelectedCity(e.target.value)}
                          className="mt-1 block w-full p-2 border rounded"
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
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default Sidebar;
