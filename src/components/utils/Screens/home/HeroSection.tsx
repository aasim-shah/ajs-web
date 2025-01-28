import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { FiSearch } from 'react-icons/fi';
import { TiLocationOutline } from 'react-icons/ti';
import { Button } from '@/components/ui/button';
import PakistanCities from '@/components/repeatComponents/CitiesName';
import { useRouter } from 'next/navigation';

const HeroSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const title = "Explore Over ";
  const spanText = "7,000+ ";
  const afterSpanText = "Job Opportunities";
  const subtitle = "Discover a platform tailored for passionate job seekers interested in startups. Find your next career opportunity and connect with like-minded individuals.";
  const backgroundImage = "/images/net.png";
  const titleClassName = "text-3xl md:text-7xl leading-10 text-center md:pt-44 font-bold text-darkGrey";
  const spanClassName = "text-signature";
  const suggestionText = 'Designer, Programming, Digital Marketing, Video, Animation';
  const showSuggestions = true;

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
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

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (location) params.set('location', location);

    router.push(`/home-findjobs?${params.toString()}`);
  };

  const suggestions = suggestionText.split(',').map((suggestion) => suggestion.trim());

  return (
    <div className="md:max-w-4xl sm:max-w-xl md:mx-auto px-4  ">
      <div className="pb-8">
        {/* Section for screens md and above, layout remains unchanged */}
        {backgroundImage && (
          <div
            className="hidden md:block bg-cover bg-center   bg-no-repeat"
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
            {subtitle && (
    <div className="py-4">
      <p className="text-lg text-center text-paragraphBlue">
        {subtitle}
      </p>
    </div>
  )}
          </div>
        )}

        {/* Section for screens below md, simplified layout */}
        <div className="block pt-16 md:hidden">
          <h1 className={titleClassName}>
            {title} {spanText && <span className={spanClassName}>{spanText}</span>}{afterSpanText}
          </h1>
          {subtitle && (
            <div className="py-4">
              <p className="text-lg text-center leading-10 text-paragraphBlue">
                {subtitle}
              </p>
            </div>
          )}
        </div>

        {/* Common elements */}
        <div className="max-w-4xl bg-background border justify-between rounded-lg p-3 flex flex-col md:flex-row gap-5 items-center mt-8 mx-auto">
          <div className="relative flex items-center w-full md:w-auto">
            <FiSearch size={35} className="absolute inset-y-1 text-signature left-0 pl-3 pointer-events-none" />
            <Input
              type="text"
              placeholder="Job title, Keyword..."
              className="pl-12 text-inputGrey text-lg md:border-none md:outline-none w-full"
              disableFocusStyles
              value={searchTerm}
              onChange={handleSearchInputChange}
            />
          </div>
          <div className="md:border-l relative flex items-center w-full md:w-auto" ref={dropdownRef}>
            <TiLocationOutline size={35} className="absolute text-signature inset-y-1 left-0 pl-3 pointer-events-none" />
            <Input
              type="text"
              placeholder="Your Location"
              className="pl-12 md:border-none text-inputGrey text-lg md:outline-none w-full"
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
                    }}
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button onClick={handleSearch} className="bg-signature text-background text-sm px-4 py-3 rounded-md">
            Find Jobs
          </Button>
        </div>

        {/* Suggestions */}
        {showSuggestions && (
          <div className="max-w-4xl text-suggestion flex md:justify-start text-center mt-4 flex-wrap">
            <span className="mr-2">Suggestion:</span>
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

export default HeroSection;
