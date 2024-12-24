import { Button } from "@/components/ui/button";
import { categories } from "@/data/categories";
import type { Job } from "@/data/types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface CategoryFilterProps {
  selectedCategory: string | null;
  selectedCity: string | null;
  onSelectCategory: (category: string | null) => void;
  onSelectCity: (city: string | null) => void;
  jobs?: Job[];
}

const CategoryFilter = ({ 
  selectedCategory, 
  selectedCity,
  onSelectCategory,
  onSelectCity,
  jobs = []
}: CategoryFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeCities = Array.from(new Set(jobs.map(job => job.city).filter(Boolean))) as string[];

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-sm border">
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.slice(0, 4).map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.name;
          return (
            <Button
              key={category.name}
              variant={isSelected ? "default" : "secondary"}
              size="sm"
              className={`text-sm px-3 py-1.5 rounded-full transition-all hover:scale-105 ${
                isSelected ? 'shadow-md ring-2 ring-primary ring-offset-2' : 'hover:bg-secondary/80'
              }`}
              onClick={() => onSelectCategory(isSelected ? null : category.name)}
            >
              <Icon className="mr-1.5 h-3.5 w-3.5" />
              <span>{category.name}</span>
            </Button>
          );
        })}
      </div>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full flex justify-between items-center">
            <span>More filters</span>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="pt-4 space-y-6">
            <div>
              <h2 className="text-sm font-semibold mb-3">More Categories</h2>
              <div className="flex flex-wrap gap-2">
                {categories.slice(4).map((category) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategory === category.name;
                  return (
                    <Button
                      key={category.name}
                      variant={isSelected ? "default" : "secondary"}
                      size="sm"
                      className={`text-sm px-3 py-1.5 rounded-full transition-all hover:scale-105 ${
                        isSelected ? 'shadow-md ring-2 ring-primary ring-offset-2' : 'hover:bg-secondary/80'
                      }`}
                      onClick={() => onSelectCategory(isSelected ? null : category.name)}
                    >
                      <Icon className="mr-1.5 h-3.5 w-3.5" />
                      <span>{category.name}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {activeCities.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold mb-3">Location</h2>
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
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default CategoryFilter;