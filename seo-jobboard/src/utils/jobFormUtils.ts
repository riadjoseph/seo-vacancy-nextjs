import { JobFormData } from "@/types/job";
import { supabase } from "@/integrations/supabase/client";
import { addDays } from "date-fns";
import { createJobSlug } from "@/utils/jobUtils";

export const processJobData = (formData: JobFormData) => {
  const { duration, ...jobDataWithoutDuration } = formData;
  const expirationDate = addDays(new Date(formData.start_date), parseInt(duration));
  
  return {
    ...jobDataWithoutDuration,
    salary_min: formData.hide_salary ? null : parseFloat(formData.salary_min) || null,
    salary_max: formData.hide_salary ? null : parseFloat(formData.salary_max) || null,
    start_date: new Date(formData.start_date).toISOString(),
    expires_at: expirationDate.toISOString(),
  };
};

export const saveJob = async (jobData: any, jobId?: string) => {
  if (jobId) {
    return await supabase
      .from("jobs")
      .update(jobData)
      .eq("id", jobId);
  }
  
  return await supabase
    .from("jobs")
    .insert(jobData);
};

export const deleteJob = async (jobId: string) => {
  return await supabase
    .from("jobs")
    .delete()
    .eq("id", jobId);
};

export const fetchJobById = async (jobId: string) => {
  return await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .single();
};