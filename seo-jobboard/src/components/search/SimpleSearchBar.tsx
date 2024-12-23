import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SimpleSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SimpleSearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search jobs..."
}: SimpleSearchBarProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        className="pl-10 w-full"
      />
    </div>
  );
};

export default SimpleSearchBar;