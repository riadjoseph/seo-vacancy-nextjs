import { supabase } from "@/integrations/supabase/client";
import { addDays } from "date-fns";
import { createJobSlug } from "@/utils/jobUtils";
import { JobFormData } from "@/types/job";

export const submitJob = async (formData: JobFormData, jobId?: string) => {
  const expirationDate = addDays(new Date(formData.start_date), parseInt(formData.duration));
  
  const { duration, ...jobDataWithoutDuration } = formData;
  
  const jobData = {
    ...jobDataWithoutDuration,
    salary_min: formData.hide_salary ? null : parseFloat(formData.salary_min) || null,
    salary_max: formData.hide_salary ? null : parseFloat(formData.salary_max) || null,
    start_date: new Date(formData.start_date).toISOString(),
    expires_at: expirationDate.toISOString(),
    user_id: (await supabase.auth.getUser()).data.user?.id
  };

  if (jobId) {
    const { error } = await supabase
      .from("jobs")
      .update(jobData)
      .eq("id", jobId);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("jobs")
      .insert(jobData);
    if (error) throw error;
  }

  return createJobSlug(jobData.title, jobData.company_name, jobData.city || 'remote');
};

export const deleteJob = async (jobId: string) => {
  const { error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", jobId);
  
  if (error) throw error;
};