import React, { useState, useEffect } from 'react';
import { Country, State, City } from 'country-state-city';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CountrySelectorProps {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({ selectedCountry, setSelectedCountry }) => {
  const [countries, setCountries] = useState<{ name: string; isoCode: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    // Fetch all countries
    const allCountries = Country.getAllCountries().map((country) => ({
      name: country.name,
      isoCode: country.isoCode,
    }));
    setCountries(allCountries);
  }, []);

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{selectedCountry || 'Select Country'}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-60 overflow-y-auto">
        <DropdownMenuLabel>Countries</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-2">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {filteredCountries.map((country) => (
          <DropdownMenuItem
            key={country.isoCode}
            onClick={() => setSelectedCountry(country.name)}
          >
            {country.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CountrySelector;
