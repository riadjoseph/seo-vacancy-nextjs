import { Button } from "@/components/ui/button";
import type { Job } from "@/data/types";

interface CityFilterProps {
  selectedCity: string | null;
  onSelectCity: (city: string | null) => void;
  jobs?: Job[];
}

const CityFilter = ({ 
  selectedCity,
  onSelectCity,
  jobs = []
}: CityFilterProps) => {
  const activeCities = Array.from(new Set(jobs.map(job => job.city).filter(Boolean))) as string[];

  return (
    <div className="bg-white/50 backdrop-blur-sm sticky top-0 z-10 p-4 shadow-sm border">
      {activeCities.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold mb-3">Filter by location</h2>
          <div className="flex flex-wrap gap-2">
            {activeCities.map((city) => {
              const isSelected = selectedCity === city;
              return (
                <Button
                  key={city}
                  variant={isSelected ? "default" : "secondary"}
                  size="sm"
                  className={`text-sm px-3 py-1.5 rounded-full transition-all hover:scale-105 ${
                    isSelected ? 'shadow-md ring-2 ring-primary ring-offset-2' : 'hover:bg-secondary/80'
                  }`}
                  onClick={() => onSelectCity(isSelected ? null : city)}
                >
                  {city}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CityFilter;