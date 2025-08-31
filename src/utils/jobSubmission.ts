import { createClient } from '@/lib/supabase/client';
import { createJobSlug } from '@/utils/jobUtils';
import { JobFormData } from '@/utils/jobValidation';

export const submitJob = async (formData: JobFormData, jobId?: string): Promise<{ jobId: string; slug: string }> => {
  const supabase = createClient();
  
  // Calculate expiration date
  const startDate = new Date(formData.start_date);
  const expirationDate = new Date(startDate);
  expirationDate.setDate(startDate.getDate() + parseInt(formData.duration));

  const { duration, ...jobDataWithoutDuration } = formData;

  const jobData = {
    ...jobDataWithoutDuration,
    tags: formData.tags.map(tag => tag.label), // Convert to string array
    salary_min: formData.hide_salary || !formData.salary_min ? null : parseFloat(formData.salary_min) || null,
    salary_max: formData.hide_salary || !formData.salary_max ? null : parseFloat(formData.salary_max) || null,
    start_date: startDate.toISOString(),
    expires_at: expirationDate.toISOString(),
    user_id: (await supabase.auth.getUser()).data.user?.id,
  };

  if (jobId) {
    // Update existing job
    const { error } = await supabase.from('jobs').update(jobData).eq('id', jobId);
    if (error) throw error;

    const updatedJobSlug = createJobSlug(jobData.title, jobData.company_name, jobData.city || 'remote');
    return { jobId, slug: updatedJobSlug };
  } else {
    // Insert new job
    const { data, error } = await supabase.from('jobs').insert(jobData).select('id').single();
    if (error) throw error;

    const newJobSlug = createJobSlug(jobData.title, jobData.company_name, jobData.city || 'remote');
    return { jobId: data.id, slug: newJobSlug };
  }
};

export const deleteJob = async (jobId: string): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase.from('jobs').delete().eq('id', jobId);

  if (error) throw error;
};