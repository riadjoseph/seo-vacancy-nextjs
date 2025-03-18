import { Button } from "./ui/button";
import { Job } from "@/data/types";

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
  // Ensure we have an array and filter out any null/undefined cities
  const activeCities = Array.from(
    new Set(
      (jobs || [])
        .map(job => job.city)
        .filter((city): city is string => Boolean(city))
    )
  ).sort();

  return (
    <div className="sticky top-[72px] z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {activeCities.length > 0 && (
            <>
              {activeCities.map((city) => {
                const isSelected = selectedCity === city;
                return (
                  <Button
                    key={city}
                    variant={isSelected ? "default" : "ghost"}
                    size="sm"
                    className="whitespace-nowrap"
                    onClick={() => onSelectCity(isSelected ? null : city)}
                  >
                    {city}
                  </Button>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecondaryMenu;
