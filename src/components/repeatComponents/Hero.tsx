"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { FiSearch } from 'react-icons/fi';
import { TiLocationOutline } from 'react-icons/ti';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import PakistanCities from './CitiesName';

interface HeroProps {
  title: string;
  subtitle?: string;
  suggestionText?: string;
  showSuggestions?: boolean;
  backgroundImage?: string;
  titleClassName?: string;
  spanText?: string;
  afterSpanText?: string;
  spanClassName?: string;
  showSearchBar?: boolean;
  onSearch?: (searchTerm: string, location: string) => void;
  showSearchFields?: boolean;
}
 
const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  suggestionText = 'Designer, Programming, Digital Marketing, Video, Animation',
  showSuggestions = true,
  backgroundImage,
  titleClassName = 'text-2xl md:text-5xl md:pt-8 text-center font-bold text-customgrayblue',
  spanText,
  afterSpanText,
  spanClassName = 'text-signature',
  showSearchBar = true,
  onSearch,
  showSearchFields = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    if (onSearch) {
      onSearch(newSearchTerm, location);
    }
  };

  const handleLocationInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLocation = event.target.value;
    setLocation(newLocation);

    if (newLocation) {
      const filtered = PakistanCities.filter(city =>
        city.toLowerCase().includes(newLocation.toLowerCase()) ||
        isFuzzyMatch(city.toLowerCase(), newLocation.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }

    if (onSearch) {
      onSearch(searchTerm, newLocation);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setFilteredCities([]);
    }
  };

  const isFuzzyMatch = (city: string, input: string) => {
    const inputChars = input.split('');
    let index = 0;
    for (const char of inputChars) {
      index = city.indexOf(char, index);
      if (index === -1) return false;
      index++;
    }
    return true;
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const suggestions = suggestionText.split(',').map((suggestion) => suggestion.trim());

  return (
    <div className="md:max-w-4xl md:mx-auto mx-5">
      <div className="pb-8">
        {backgroundImage && (
          <div
            className="bg-cover bg-center md:pb-10 md:pt-24  bg-no-repeat"
            style={{
              backgroundImage: `url('${backgroundImage}')`,
              backgroundSize: '600px 200px',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          >
            <h1 className={titleClassName}>
              {title} {spanText && <span className={spanClassName}>{spanText}</span>}{afterSpanText}
            </h1>
          </div>
        )}
        {!backgroundImage && (
          <h1 className={titleClassName}>
            {title} {spanText && <span className={spanClassName}>{spanText}</span>}
          </h1>
        )}
        {subtitle && (
          <div className="md:py-8">
            <p className="text-lg md:text-2xl text-center text-paragraphBlue">
              {subtitle}
            </p>
          </div>
        )}
        {showSearchBar && showSearchFields && (
          <div className="max-w-4xl bg-background border  justify-between rounded-lg p-3 flex flex-col md:flex-row gap-5 items-center mt-8 mx-auto">
            <div className="relative flex items-center">
              <FiSearch size={35} className="absolute inset-y-1 text-signature left-0 pl-3 pointer-events-none" />
              <Input
                type="text"
                placeholder="Job title, Keyword..."
                className="pl-12 text-inputGrey text-lg md:border-none md:outline-none"
                disableFocusStyles
                value={searchTerm}
                onChange={handleSearchInputChange}
              />
            </div>
            <div className="md:border-l relative flex items-center" ref={dropdownRef}>
              <TiLocationOutline size={35} className="absolute text-signature inset-y-1 left-0 pl-3 pointer-events-none" />
              <Input
                type="text"
                placeholder="Your Location"
                className="pl-12 md:border-none text-inputGrey text-lg md:outline-none"
                value={location}
                onChange={handleLocationInputChange}
                disableFocusStyles
              />
              {filteredCities.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-background border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-10">
                  {filteredCities.map(city => (
                    <div
                      key={city}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => {
                        setLocation(city);
                        setFilteredCities([]);
                        if (onSearch) {
                          onSearch(searchTerm, city);
                        }
                      }}
                    >
                      {city}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button className="bg-signature text-background text-sm px-4 py-3 rounded-md" >
             
                Find Jobs
             
            </Button>
          </div>
        )}
        {showSuggestions && (
          <div className="max-w-4xl text-suggestion flex md:justify-start text-center mt-4 flex-wrap">
            <span className=" mr-2">Suggestion:</span>
            {suggestions.map((suggestion, index) => (
              <span key={index} className="mr-2">
                {suggestion}
                {index < suggestions.length - 1 && ','}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
