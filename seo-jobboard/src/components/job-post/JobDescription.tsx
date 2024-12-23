import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories } from "@/data/categories";
import { SEO_SPECIALIZATIONS, SeoSpecialization } from "@/data/types";
import { Badge } from "@/components/ui/badge";

interface JobDescriptionProps {
  formData: {
    description: string;
    tags: SeoSpecialization[];
    category: string;
    job_url: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onTagsChange: (tags: SeoSpecialization[]) => void;
  onCategoryChange?: (value: string) => void;
  errors?: Record<string, string>;
}

const JobDescription = ({ formData, handleChange, onTagsChange, onCategoryChange, errors = {} }: JobDescriptionProps) => {
  const handleTagSelect = (tag: SeoSpecialization) => {
    const newTags = formData.tags.includes(tag)
      ? formData.tags.filter(t => t !== tag)
      : [...formData.tags, tag];
    onTagsChange(newTags);
  };

  const wordCount = formData.description.trim().split(/\s+/).length;
  const minWords = 100;

  return (
    <>
      <div>
        <Label className="block text-sm font-medium mb-2">Description</Label>
        <Textarea
          required
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={5}
          className={errors.description ? "border-red-500" : ""}
          placeholder="Describe the role, responsibilities, and requirements..."
        />
        <div className="mt-1.5 space-y-1">
          <p className="text-sm text-muted-foreground">
            Requirements for a quality job description:
          </p>
          <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
            <li>Minimum {minWords} words ({wordCount} current)</li>
            <li>Include clear responsibilities and requirements</li>
            <li>Mention required years of experience</li>
            <li>List essential skills and qualifications</li>
            <li>Use inclusive language</li>
            <li>Avoid gender-specific terms</li>
            <li>Mention if the position is open to entry-level candidates</li>
          </ul>
        </div>
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">{errors.description}</p>
        )}
      </div>

      <div>
        <Label className="block text-sm font-medium mb-2">SEO Specializations (max 5)</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {SEO_SPECIALIZATIONS.map((specialization) => (
            <Badge
              key={specialization}
              variant={formData.tags.includes(specialization) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleTagSelect(specialization)}
            >
              {specialization}
            </Badge>
          ))}
        </div>
        {errors.tags && (
          <p className="text-sm text-red-500 mt-1">{errors.tags}</p>
        )}
        <p className="text-sm text-muted-foreground mt-1.5">
          Select up to 5 SEO specializations that best describe this position.
        </p>
      </div>

      <div>
        <Label className="block text-sm font-medium mb-2">Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => onCategoryChange?.(value)}
        >
          <SelectTrigger className={`w-full bg-white ${errors.category ? "border-red-500" : ""}`}>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <SelectItem 
                  key={category.name} 
                  value={category.name}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {category.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-red-500 mt-1">{errors.category}</p>
        )}
      </div>

      <div>
        <Label className="block text-sm font-medium mb-2">Application URL</Label>
        <Input
          required
          name="job_url"
          value={formData.job_url}
          onChange={handleChange}
          placeholder="https://..."
          className={errors.job_url ? "border-red-500" : ""}
        />
        {errors.job_url && (
          <p className="text-sm text-red-500 mt-1">{errors.job_url}</p>
        )}
      </div>
    </>
  );
};

export default JobDescription;