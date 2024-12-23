import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

interface JobDatesProps {
  formData: {
    start_date: string;
    duration: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDurationChange: (value: string) => void;
  errors?: Record<string, string>;
}

const JobDates = ({ formData, handleChange, handleDurationChange, errors = {} }: JobDatesProps) => {
  return (
    <>
      <div>
        <Label className="block text-sm font-medium mb-2">Start Date</Label>
        <Input
          required
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          min={format(new Date(), 'yyyy-MM-dd')}
          className={errors.start_date ? "border-red-500" : ""}
        />
        {errors.start_date && (
          <p className="text-sm text-red-500 mt-1">{errors.start_date}</p>
        )}
      </div>

      <div>
        <Label className="block text-sm font-medium mb-2">Job Post Duration</Label>
        <Select
          value={formData.duration}
          onValueChange={handleDurationChange}
        >
          <SelectTrigger className={errors.duration ? "border-red-500" : ""}>
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="14">14 days</SelectItem>
            <SelectItem value="30">30 days</SelectItem>
            <SelectItem value="45">45 days</SelectItem>
            <SelectItem value="60">60 days</SelectItem>
            <SelectItem value="90">90 days</SelectItem>
          </SelectContent>
        </Select>
        {errors.duration && (
          <p className="text-sm text-red-500 mt-1">{errors.duration}</p>
        )}
      </div>
    </>
  );
};

export default JobDates;