import React, { useState, useEffect } from 'react';
import { City } from 'country-state-city';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CitySelectorProps {
  selectedCountry: string;
  selectedState: string;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
}

const CitySelector: React.FC<CitySelectorProps> = ({ selectedCountry, selectedState, selectedCity, setSelectedCity }) => {
  const [cities, setCities] = useState<{ name: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (selectedCountry && selectedState) {
      // Fetch cities of the selected state
      const allCities = City.getCitiesOfState(selectedCountry, selectedState).map((city) => ({
        name: city.name,
      }));
      setCities(allCities);
    }
  }, [selectedCountry, selectedState]);

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{selectedCity || 'Select City'}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-60 overflow-y-auto">
        <DropdownMenuLabel>Cities</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-2">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {filteredCities.length > 0 ? (
          filteredCities.map((city) => (
            <DropdownMenuItem
              key={city.name}
              onClick={() => setSelectedCity(city.name)}
            >
              {city.name}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No cities found</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CitySelector;
