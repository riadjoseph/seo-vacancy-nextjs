import { useEffect, useState } from "react";
import { useRouteError } from "react-router-dom";
import { Helmet } from "react-helmet";
import { supabase } from "@/integrations/supabase/client";
import MarkdownDisplay from '@/MarkdownDisplay';
import type { JobFormData } from "@/types/job";

const JobErrorBoundary = () => {
  const error = useRouteError() as { status?: number };
  const [content, setContent] = useState<JSX.Element | null>(null);

  useEffect(() => {
    const fetchExpiredJob = async () => {
      const jobId = window.location.pathname.split('/').pop();
      const statusCode = error instanceof Response ? error.status : 404;
      
      // Set both document-level and HTTP status code
      document.documentElement.dataset.status = statusCode.toString();
      
      // Create and dispatch a custom event to set the HTTP status code
      const statusEvent = new CustomEvent('httpStatus', { detail: statusCode });
      window.dispatchEvent(statusEvent);

      if (error instanceof Response && error.status === 410) {
        const { data } = await supabase
          .from("jobs")
          .select()
          .eq("id", jobId)
          .single();
        
        if (data) {
          setContent(
            <>
              <Helmet>
                <title>Job Expired | {data.title}</title>
                <meta name="robots" content="noindex" />
                <meta httpEquiv="Status" content="410" />
              </Helmet>
              <LocalExpiredJobPage job={data} />
            </>
          );
          return;
        }
      }
      
      setContent(
        <>
          <Helmet>
            <title>Job Not Found | Job Board</title>
            <meta name="robots" content="noindex" />
            <meta httpEquiv="Status" content="404" />
          </Helmet>
          <div className="container mx-auto py-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Job Not Found</h1>
            <p className="text-gray-600 mb-8">The job posting you're looking for doesn't exist or has been removed.</p>
            <a href="/" className="text-blue-500 hover:underline">Browse all jobs</a>
          </div>
        </>
      );
    };

    fetchExpiredJob();
  }, [error]);

  if (!content) {
    return <div>Loading...</div>;
  }

  return content;
};

const LocalExpiredJobPage = ({ job }: { job: JobFormData }) => {
  return (
    <div>
      <div className="job-description">
        <MarkdownDisplay markdown={job.description} />
      </div>
    </div>
  );
};

export default JobErrorBoundary;