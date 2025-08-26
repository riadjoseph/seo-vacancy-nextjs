import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface JobSalaryProps {
  formData: {
    salary_min: string;
    salary_max: string;
    salary_currency: string;
    hide_salary?: boolean;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCurrencyChange: (value: string) => void;
  onHideSalaryChange?: (checked: boolean) => void;
  errors?: Record<string, string>;
}

const JobSalary = ({ formData, handleChange, handleCurrencyChange, onHideSalaryChange, errors = {} }: JobSalaryProps) => {
  return (
    <div>
      <Label className="block text-sm font-medium mb-4">Salary Information (Optional)</Label>
      <p className="text-sm text-gray-500 mb-4">
        Leave salary fields empty if you prefer not to disclose salary information. Empty salary fields will not be displayed on the job listing.
      </p>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="block text-sm font-medium mb-2">Minimum Salary</Label>
          <Input
            type="number"
            name="salary_min"
            value={formData.salary_min}
            onChange={handleChange}
            disabled={formData.hide_salary}
            placeholder="e.g. 50000"
            className={errors.salary_min ? "border-red-500" : ""}
          />
          {errors.salary_min && (
            <p className="text-sm text-red-500 mt-1">{errors.salary_min}</p>
          )}
        </div>
        <div>
          <Label className="block text-sm font-medium mb-2">Maximum Salary</Label>
          <Input
            type="number"
            name="salary_max"
            value={formData.salary_max}
            onChange={handleChange}
            disabled={formData.hide_salary}
            placeholder="e.g. 70000"
            className={errors.salary_max ? "border-red-500" : ""}
          />
          {errors.salary_max && (
            <p className="text-sm text-red-500 mt-1">{errors.salary_max}</p>
          )}
        </div>
        <div className="col-span-2">
          <Label className="block text-sm font-medium mb-2">Currency</Label>
          <Select
            value={formData.salary_currency}
            onValueChange={handleCurrencyChange}
            disabled={formData.hide_salary}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="€">€ (EUR)</SelectItem>
              <SelectItem value="$">$ (USD)</SelectItem>
              <SelectItem value="£">£ (GBP)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="mt-4 flex items-center space-x-2">
        <Checkbox 
          id="hide-salary" 
          checked={formData.hide_salary} 
          onCheckedChange={(checked) => onHideSalaryChange?.(checked as boolean)}
        />
        <Label htmlFor="hide-salary" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Do not publish salary information
        </Label>
      </div>
    </div>
  );
};

export default JobSalary;