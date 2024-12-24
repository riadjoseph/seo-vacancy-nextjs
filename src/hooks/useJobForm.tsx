import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { validateJobPost } from "@/utils/jobValidation";
import type { SeoSpecialization } from "@/data/types";
import { submitJob, deleteJob } from "@/utils/jobSubmission";

interface JobFormData {
  title: string;
  company_name: string;
  company_logo: string;
  description: string;
  tags: SeoSpecialization[];
  category: string;
  job_url: string;
  salary_min: string;
  salary_max: string;
  salary_currency: string;
  start_date: string;
  duration: string;
  city: string;
  hide_salary?: boolean;
  featured?: boolean;
}

const initialFormData: JobFormData = {
  title: "",
  company_name: "",
  company_logo: "",
  description: "",
  tags: [],
  category: "",
  job_url: "",
  salary_min: "",
  salary_max: "",
  salary_currency: "€",
  start_date: "",
  duration: "30",
  city: "",
  hide_salary: false,
  featured: false
};

export const useJobForm = (jobId?: string) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<JobFormData>(initialFormData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const validation = validateJobPost(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      setLoading(false);
      toast({
        title: "Validation Error",
        description: `Please improve your job posting quality (Current score: ${Math.round(validation.score)}%). Ensure all fields are filled with meaningful content.`,
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    try {
      await submitJob(formData, jobId);
      
      toast({
        title: "Success",
        description: `Job successfully ${jobId ? 'updated' : 'posted'}`,
      });
      
      navigate('/my-jobs');
    } catch (error) {
      console.error("Error in job submission:", error);
      toast({
        title: "Error",
        description: `Failed to ${jobId ? 'update' : 'post'} job. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!jobId || !window.confirm('Are you sure you want to delete this job post?')) return;

    setLoading(true);
    try {
      await deleteJob(jobId);
      toast({
        title: "Success",
        description: "Job post deleted successfully",
      });
      navigate('/my-jobs');
    } catch (error) {
      console.error("Error deleting job:", error);
      toast({
        title: "Error",
        description: "Failed to delete job post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    loading,
    handleSubmit,
    handleDelete,
    errors
  };
};