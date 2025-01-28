import React, { useState, useEffect } from 'react';
import { Country, State, City } from 'country-state-city';
import { ICountry, IState, ICity } from 'country-state-city';

interface LocationSelectorProps {
  selectedCountry: string;
  setSelectedCountry: (value: string) => void;
  selectedState: string;
  setSelectedState: (value: string) => void;
  selectedCity: string;
  setSelectedCity: (value: string) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedCountry,
  setSelectedCountry,
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
}) => {
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [countrySearch, setCountrySearch] = useState('');
  const [stateSearch, setStateSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      setStates(State.getStatesOfCountry(selectedCountry));
      setCities([]);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      setCities(City.getCitiesOfState(selectedCountry, selectedState));
    }
  }, [selectedState]);

  const filterCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const filterStates = states.filter((state) =>
    state.name.toLowerCase().includes(stateSearch.toLowerCase())
  );

  const filterCities = cities.filter((city) =>
    city.name.toLowerCase().includes(citySearch.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
        <div className="relative">
          <select
            id="country"
            value={selectedCountry}
            onChange={(e) => {
              setSelectedCountry(e.target.value);
              setCountrySearch('');
            }}
            className="block w-full p-2 border rounded-md"
          >
            <option value="">Select Country</option>
            {filterCountries.map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search country..."
            value={countrySearch}
            onChange={(e) => setCountrySearch(e.target.value)}
            className="absolute top-0 left-0 block w-full p-2 border rounded-md mt-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
        <div className="relative">
          <select
            id="state"
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setStateSearch('');
            }}
            className="block w-full p-2 border rounded-md"
            disabled={!states.length}
          >
            <option value="">Select State</option>
            {filterStates.map((state) => (
              <option key={state.isoCode} value={state.isoCode}>
                {state.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search state..."
            value={stateSearch}
            onChange={(e) => setStateSearch(e.target.value)}
            className="absolute top-0 left-0 block w-full p-2 border rounded-md mt-1"
            disabled={!states.length}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
        <div className="relative">
          <select
            id="city"
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              setCitySearch('');
            }}
            className="block w-full p-2 border rounded-md"
            disabled={!cities.length}
          >
            <option value="">Select City</option>
            {filterCities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search city..."
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
            className="absolute top-0 left-0 block w-full p-2 border rounded-md mt-1"
            disabled={!cities.length}
          />
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;
