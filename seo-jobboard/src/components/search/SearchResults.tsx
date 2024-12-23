import { Command, CommandGroup, CommandItem } from "@/components/ui/command";

interface SearchResultsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  visible: boolean;
}

const SearchResults = ({ suggestions = [], onSelect, visible }: SearchResultsProps) => {
  // Early return if conditions aren't met
  if (!visible || !Array.isArray(suggestions) || suggestions.length === 0) {
    return null;
  }

  // Additional safety check for suggestions array
  const validSuggestions = suggestions.filter(Boolean);
  if (validSuggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute z-50 w-full mt-1">
      <Command shouldFilter={false} className="rounded-lg border shadow-md">
        <CommandGroup>
          {validSuggestions.map((suggestion, index) => (
            <CommandItem
              key={`${suggestion}-${index}`}
              onSelect={() => onSelect(suggestion)}
            >
              {suggestion}
            </CommandItem>
          ))}
        </CommandGroup>
      </Command>
    </div>
  );
};

export default SearchResults;