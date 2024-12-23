import { categories } from "@/data/categories";
import { Button } from "./ui/button";
import { Job } from "@/data/types";

interface SecondaryMenuProps {
  selectedCategory: string | null;
  selectedCity: string | null;
  onSelectCategory: (category: string | null) => void;
  onSelectCity: (city: string | null) => void;
  jobs?: Job[];
}

const SecondaryMenu = ({
  selectedCategory,
  selectedCity,
  onSelectCategory,
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
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.name;
            return (
              <Button
                key={category.name}
                variant={isSelected ? "default" : "ghost"}
                size="sm"
                className="whitespace-nowrap"
                onClick={() => onSelectCategory(isSelected ? null : category.name)}
              >
                <Icon className="mr-1.5 h-3.5 w-3.5" />
                <span>{category.name}</span>
              </Button>
            );
          })}
          {activeCities.length > 0 && (
            <>
              <div className="mx-2 h-4 w-[1px] bg-border" />
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