'use client';

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import JobBasicInfo from "./JobBasicInfo";
import JobDescription from "./JobDescription";
import JobSalary from "./JobSalary";
import JobDates from "./JobDates";
import JobFeatured from "./JobFeatured";
import { useJobForm } from "@/hooks/useJobForm";
import type { SeoSpecializationOption } from "@/data/types";

interface JobPostingFormProps {
  onClose?: () => void;
  onSuccess?: () => void;
  initialData?: any; // Replace with proper type
}

const JobPostingForm: React.FC<JobPostingFormProps> = ({ 
  onClose, 
  onSuccess,
  initialData 
}) => {
  const { 
    formData, 
    setFormData, 
    loading, 
    handleSubmit, 
    errors 
  } = useJobForm(undefined, initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFinalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await handleSubmit(e);
    if (success) {
      onSuccess?.();
      onClose?.();
    }
  };

  return (
    <Card className="p-8 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Post a New Job</h2>
      <form onSubmit={handleFinalSubmit} className="space-y-6">
        <JobBasicInfo 
          formData={formData} 
          handleChange={handleChange}
          handleCityChange={(city) => setFormData((prev) => ({ ...prev, city }))}
          errors={errors}
        />
        <JobDescription 
          formData={formData} 
          handleChange={handleChange}
          onTagsChange={(tags: SeoSpecializationOption[]) =>
            setFormData((prev) => ({ ...prev, tags }))
          }
          onCategoryChange={(category) =>
            setFormData((prev) => ({ ...prev, category }))
          }
          errors={errors}
        />
        <JobSalary 
          formData={formData} 
          handleChange={handleChange}
          handleCurrencyChange={(currency) =>
            setFormData((prev) => ({ ...prev, salary_currency: currency }))
          }
          onHideSalaryChange={(checked) =>
            setFormData((prev) => ({ ...prev, hide_salary: checked }))
          }
          errors={errors}
        />
        <JobDates 
          formData={formData}
          handleChange={handleChange}
          handleDurationChange={(duration) =>
            setFormData((prev) => ({ ...prev, duration }))
          }
          errors={errors}
        />
        <JobFeatured
          formData={formData}
          onFeaturedChange={(featured) =>
            setFormData((prev) => ({ ...prev, featured }))
          }
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Saving..." : "Post Job"}
          </Button>
          {onClose && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="flex-1"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};

export default JobPostingForm;