import React, { useState, useEffect } from 'react';
import { State } from 'country-state-city';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface StateSelectorProps {
  selectedCountry: string;
  selectedState: string;
  setSelectedState: (state: string) => void;
}

const StateSelector: React.FC<StateSelectorProps> = ({ selectedCountry, selectedState, setSelectedState }) => {
  const [states, setStates] = useState<{ name: string; isoCode: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (selectedCountry) {
      // Fetch states of the selected country
      const allStates = State.getStatesOfCountry(selectedCountry).map((state) => ({
        name: state.name,
        isoCode: state.isoCode,
      }));
      setStates(allStates);
    }
  }, [selectedCountry]);

  const filteredStates = states.filter((state) =>
    state.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{selectedState || 'Select State'}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-60 overflow-y-auto">
        <DropdownMenuLabel>States</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-2">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="max-h-40 overflow-y-auto"> {/* Scrollable area */}
          {filteredStates.length > 0 ? (
            filteredStates.map((state) => (
              <DropdownMenuItem
                key={state.isoCode}
                onClick={() => setSelectedState(state.name)}
              >
                {state.name}
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled>No states available</DropdownMenuItem>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StateSelector;
