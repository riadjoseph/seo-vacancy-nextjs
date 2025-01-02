import { supabase } from "@/integrations/supabase/client";
import { addDays } from "date-fns";
import { createJobSlug } from "@/utils/jobUtils";
import { JobFormData } from "@/types/job";

/**
 * Submits a job (either creating or updating it) and returns the job's ID and slug.
 * @param {JobFormData} formData - The job data to submit.
 * @param {string} [jobId] - The ID of the job to update (if applicable).
 * @returns {Promise<{ jobId: string, slug: string }>} - The job's ID and slug.
 */
export const submitJob = async (formData: JobFormData, jobId?: string): Promise<{ jobId: string; slug: string }> => {
  const expirationDate = addDays(new Date(formData.start_date), parseInt(formData.duration));

  const { duration, ...jobDataWithoutDuration } = formData;

  const jobData = {
    ...jobDataWithoutDuration,
    salary_min: formData.hide_salary ? null : parseFloat(formData.salary_min) || null,
    salary_max: formData.hide_salary ? null : parseFloat(formData.salary_max) || null,
    start_date: new Date(formData.start_date).toISOString(),
    expires_at: expirationDate.toISOString(),
    user_id: (await supabase.auth.getUser()).data.user?.id,
  };

  if (jobId) {
    // Update existing job
    const { error } = await supabase.from("jobs").update(jobData).eq("id", jobId);
    if (error) throw error;

    const updatedJobSlug = createJobSlug(jobData.title, jobData.company_name, jobData.city || "remote");
    return { jobId, slug: updatedJobSlug };
  } else {
    // Insert new job
    const { data, error } = await supabase.from("jobs").insert(jobData).select("id").single();
    if (error) throw error;

    const newJobSlug = createJobSlug(jobData.title, jobData.company_name, jobData.city || "remote");
    return { jobId: data.id, slug: newJobSlug };
  }
};

/**
 * Deletes a job by its ID.
 * @param {string} jobId - The ID of the job to delete.
 * @returns {Promise<void>} - Resolves when the job is deleted.
 */
export const deleteJob = async (jobId: string): Promise<void> => {
  const { error } = await supabase.from("jobs").delete().eq("id", jobId);

  if (error) throw error;
};