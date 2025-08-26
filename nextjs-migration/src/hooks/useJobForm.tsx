import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { validateJobPost, JobFormData } from '@/utils/jobValidation';
import { submitJob, deleteJob } from '@/utils/jobSubmission';
import { SeoSpecializationOption } from '@/data/types';
import { trackEvent } from '@/lib/analytics';

const initialFormData: JobFormData = {
  title: '',
  company_name: '',
  company_logo: '',
  description: '',
  tags: [],
  category: '',
  job_url: '',
  salary_min: '',
  salary_max: '',
  salary_currency: '€',
  start_date: '',
  duration: '30',
  city: '',
  hide_salary: false,
  featured: false,
};

export const useJobForm = (jobId?: string, initialData?: Partial<JobFormData>) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<JobFormData>({
    ...initialFormData,
    ...initialData,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<boolean> => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const validation = validateJobPost(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setLoading(false);
      toast.error(
        `Please improve your job posting quality (Current score: ${Math.round(
          validation.score
        )}%). Ensure all fields are filled with meaningful content.`
      );
      return false;
    }

    try {
      const result = await submitJob(formData, jobId);
      trackEvent('job_posted', {
        job_title: formData.title,
        company: formData.company_name,
        category: formData.category,
      });
      
      toast.success(
        `Job successfully ${jobId ? 'updated' : 'posted'}!`,
        {
          action: {
            label: 'View Job',
            onClick: () => router.push(`/job/${result.slug}`),
          },
        }
      );
      
      return true;
    } catch (error: any) {
      trackEvent('job_post_error', {
        error_message: error.message,
      });
      console.error('Error in job submission:', error);
      toast.error(`Failed to ${jobId ? 'update' : 'post'} job. Please try again.`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (): Promise<boolean> => {
    if (!jobId || !window.confirm('Are you sure you want to delete this job post?')) return false;

    setLoading(true);
    try {
      await deleteJob(jobId);
      toast.success('Job post deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job post');
      return false;
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
    errors,
  };
};