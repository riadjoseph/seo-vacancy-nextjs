import { Job } from "@/data/types";
import SimpleSearchBar from "./SimpleSearchBar";

interface SearchSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  jobs: Job[];
}

const SearchSection = ({ searchQuery, onSearchChange }: SearchSectionProps) => {
  return (
    <div className="mb-8">
      <SimpleSearchBar 
        value={searchQuery} 
        onChange={onSearchChange}
        placeholder="Search jobs by title, company, location, or tags"
      />
    </div>
  );
};

export default SearchSection;