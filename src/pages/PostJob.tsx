import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import JobBasicInfo from "@/components/job-post/JobBasicInfo";
import JobDescription from "@/components/job-post/JobDescription";
import JobSalary from "@/components/job-post/JobSalary";
import JobDates from "@/components/job-post/JobDates";
import JobFeatured from "@/components/job-post/JobFeatured";
import { useJobForm } from "@/hooks/useJobForm";
import { fetchJob } from "@/utils/jobFetching";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { SeoSpecialization } from "@/data/types";

const LOCAL_STORAGE_KEY = "jobPostFormData";

const PostJob = () => {
  const { jobId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSessionValid, setIsSessionValid] = useState(false);
  const [isLoading, setIsLoading] = useState(!!jobId);
  const { formData, setFormData, loading, handleSubmit, handleDelete, errors } = useJobForm(jobId);

  // Check authentication before proceeding
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error fetching session:", error);
          return;
        }
        if (!session) {
          console.warn("No session found. Redirecting to login.");
          navigate("/login");
        } else {
          console.log("Session is valid.");
          setIsSessionValid(true);
        }
      } catch (err) {
        console.error("Unexpected error during session check:", err);
      }
    };
    checkAuth();
  }, [navigate]);

  // Load form data from local storage for new job posts
  useEffect(() => {
    if (!jobId) {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        setFormData(JSON.parse(savedData));
      }
    }
  }, [setFormData, jobId]);

  // Save form data to local storage for draft preservation
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  // Load job details if editing an existing job
  useEffect(() => {
    const loadJob = async () => {
      if (jobId && isSessionValid) {
        try {
          const job = await fetchJob(jobId);
          if (job) {
            setFormData({
              ...job,
              salary_min: job.salary_min?.toString() || "",
              salary_max: job.salary_max?.toString() || "",
              start_date: job.start_date
                ? new Date(job.start_date).toISOString().split("T")[0]
                : "",
              duration: "30",
              tags: job.tags || [],
            });
            localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear saved draft data
          }
        } catch (error) {
          console.error("Error loading job:", error);
          toast({
            title: "Error",
            description: "Failed to load job details.",
            variant: "destructive",
          });
          navigate("/my-jobs");
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (isSessionValid) {
      loadJob();
    }
  }, [jobId, isSessionValid, setFormData, toast, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFinalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleSubmit(e);
    localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear local storage on successful submit
  };

  if (!isSessionValid || isLoading) {
    return (
      <div className="container max-w-2xl py-8">
        <Card className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card className="p-8">
        <h1 className="text-2xl font-bold mb-6">
          {jobId ? "Edit Job Post" : "Post a New Job"}
        </h1>
        <p className="text-xl mb-6 text-red-600">
          {jobId
            ? "Edit Job Post"
            : "Prepare your job details information first; if you move away from this screen you will lose your work."}
        </p>
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
            onTagsChange={(tags: SeoSpecialization[]) =>
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
              {loading
                ? "Saving..."
                : jobId
                ? "Update Job"
                : "Post Job"}
            </Button>
            {jobId && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
              >
                Delete Job
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PostJob;