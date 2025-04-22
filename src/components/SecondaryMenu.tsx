import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Job } from "@/data/types";
import { X, Search } from "lucide-react";
import { Input } from "./ui/input";

interface SecondaryMenuProps {
  selectedCity: string | null;
  onSelectCity: (city: string | null) => void;
  jobs?: Job[];
}

const SecondaryMenu = ({
  selectedCity,
  onSelectCity,
  jobs = []
}: SecondaryMenuProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Control body overflow when dropdown is open
  useEffect(() => {
    if (isDropdownOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [isDropdownOpen]);

  // Ensure we have an array and filter out any null/undefined cities
  const activeCities = Array.from(
    new Set(
      (jobs || [])
        .map(job => job.city)
        .filter((city): city is string => Boolean(city))
    )
  ).sort();

  // Filter cities based on search term
  const filteredCities = searchTerm
    ? activeCities.filter(city => 
        city.toLowerCase().includes(searchTerm.toLowerCase()))
    : activeCities;

  // Handle outside clicks to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDropdownOpen]);

  return (
    <div className="sticky top-[72px] z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex items-center gap-2 w-full overflow-x-auto pb-2">
          {/* Selected city display */}
          {selectedCity && (
            <div className="flex items-center">
              <Button
                variant="default"
                size="sm"
                className="whitespace-nowrap flex items-center gap-1"
                onClick={() => onSelectCity(null)}
              >
                {selectedCity}
                <X className="h-3 w-3 ml-1" />
              </Button>
            </div>
          )}
          
          {/* City search dropdown */}
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="outline"
              size="sm"
              className="whitespace-nowrap"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <Search className="h-4 w-4 mr-2" />
              {selectedCity ? "Change location" : "Filter by location"}
            </Button>
            
            {isDropdownOpen && (
              <div className="fixed inset-0 bg-black/20 z-50 flex items-start justify-center overflow-y-auto touch-none">
                <div className="bg-background rounded-md border shadow-lg w-full max-w-md mx-4 my-20">
                  <div className="flex justify-between items-center p-3 border-b">
                    <h3 className="font-semibold">Select Location</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-3">
                    <Input
                      ref={inputRef}
                      type="text"
                      placeholder="Search cities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto p-3">
                    {filteredCities.length > 0 ? (
                      filteredCities.map((city) => (
                        <Button
                          key={city}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-left mb-1"
                          onClick={() => {
                            onSelectCity(city);
                            setIsDropdownOpen(false);
                            setSearchTerm("");
                          }}
                        >
                          {city}
                        </Button>
                      ))
                    ) : (
                      <div className="text-center p-2 text-muted-foreground text-sm">
                        No cities found
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Display most common cities when not searching */}
          {!selectedCity && !isDropdownOpen && activeCities.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto">
              {activeCities.slice(0, 5).map((city) => (
                <Button
                  key={city}
                  variant="ghost"
                  size="sm"
                  className="whitespace-nowrap"
                  onClick={() => onSelectCity(city)}
                >
                  {city}
                </Button>
              ))}
              {activeCities.length > 5 && (
                <span className="text-xs text-muted-foreground">+{activeCities.length - 5} more</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecondaryMenu;
