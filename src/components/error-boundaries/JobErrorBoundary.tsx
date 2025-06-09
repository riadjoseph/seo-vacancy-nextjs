import { useEffect, useState } from "react";
import { useRouteError } from "react-router-dom";
import { Helmet } from "react-helmet";
import { supabase } from "@/integrations/supabase/client";
import MarkdownDisplay from '@/MarkdownDisplay';
import type { JobFormData } from "@/types/job";

const JobErrorBoundary = () => {
  const error = useRouteError() as { status?: number };
  const [content, setContent] = useState<JSX.Element | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);

  // Comprehensive bot detection
  const detectBot = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const botPatterns = [
      // Search engine bots
      'adsbot', 'applebot', 'baiduspider', 'googlebot', 'mediapartners-google',
      'yandex', 'yandexbot', 'bingbot', 'naver', 'baidu', 'bing', 'google',
      
      // AI/LLM bots
      'gptbot', 'amazonbot', 'anthropic', 'bytespider', 'ccbot', 'chatgpt',
      'claudebot', 'claude', 'oai-searchbot', 'perplexity', 'youbot',
      
      // Social media bots
      'facebook', 'facebookexternalhit', 'meta-external', 'twitterbot', 'linkedinbot',
      
      // Other common crawlers
      'slurp', 'duckduckbot', 'crawler', 'spider', 'whatsapp', 'telegram'
    ];
    return botPatterns.some(pattern => userAgent.includes(pattern));
  };

  useEffect(() => {
    const fetchJobData = async () => {
      const pathParts = window.location.pathname.split('/');
      const jobSlug = pathParts[pathParts.length - 1];
      const statusCode = error instanceof Response ? error.status : 404;
      const isBot = detectBot();
      
      // Set both document-level and HTTP status code
      document.documentElement.dataset.status = statusCode.toString();
      
      // Create and dispatch a custom event to set the HTTP status code
      const statusEvent = new CustomEvent('httpStatus', { 
        detail: statusCode,
        bubbles: true,
        cancelable: true 
      });
      window.dispatchEvent(statusEvent);

      // For non-bots on job pages, try retrying if this might be a timing issue
      if (!isBot && statusCode === 404 && retryAttempts < 2 && jobSlug) {
        setIsRetrying(true);
        setRetryAttempts(prev => prev + 1);
        
        // Wait a bit longer for potential React hydration issues
        setTimeout(() => {
          console.log(`Retrying job load attempt ${retryAttempts + 1} for: ${jobSlug}`);
          window.location.reload();
        }, 1500);
        
        return;
      }

      // Handle 410 - Expired Job
      if (error instanceof Response && error.status === 410) {
        try {
          // Try to find the job by slug instead of ID
          const { data } = await supabase
            .from("jobs")
            .select("*");
          
          if (data) {
            // Find job by matching slug
            const job = data.find(job => {
              if (!job.title || !job.company_name) return false;
              const jobSlug = `${job.title}-${job.company_name}-${job.city || 'Remote'}`
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
              return jobSlug === pathParts[pathParts.length - 1];
            });
            
            if (job) {
              console.log(`Found expired job: ${job.title}`);
              setContent(
                <>
                  <Helmet>
                    <title>Job Expired | {job.title} at {job.company_name}</title>
                    <meta name="robots" content="noindex" />
                    <meta httpEquiv="Status" content="410" />
                    <meta name="description" content={`This ${job.title} position at ${job.company_name} has expired and is no longer accepting applications.`} />
                  </Helmet>
                  <LocalExpiredJobPage job={job} />
                </>
              );
              return;
            }
          }
        } catch (expiredJobError) {
          console.error('Error fetching expired job:', expiredJobError);
        }
      }
      
      // Default 404 handling
      console.log('JobErrorBoundary: Job not found', {
        path: window.location.pathname,
        slug: jobSlug,
        statusCode: statusCode,
        userAgent: navigator.userAgent,
        isBot: isBot,
        retryAttempts: retryAttempts
      });
      
      setContent(
        <>
          <Helmet>
            <title>Job Not Found | Job Board</title>
            <link rel="canonical" href="https://seo-vacancy.eu/error" />
            <meta name="robots" content="noindex" />
            <meta httpEquiv="Status" content="404" />
            <meta name="description" content="The job posting you're looking for doesn't exist or has been removed. Browse our current job opportunities." />
          </Helmet>
          <div className="container mx-auto py-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Job Not Found</h1>
            <p className="text-gray-600 mb-8">
              The job posting you're looking for doesn't exist or has been removed.
            </p>
            <div className="space-y-4">
              <a href="/" className="text-blue-500 hover:underline block">
                Browse all jobs
              </a>
              <a href="/jobs" className="text-blue-500 hover:underline block">
                View job categories
              </a>
            </div>
            
            {/* Debug info for development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 bg-gray-100 rounded text-left text-sm">
                <strong>Debug Info:</strong><br />
                Path: {window.location.pathname}<br />
                Slug: {jobSlug}<br />
                Status: {statusCode}<br />
                User Agent: {navigator.userAgent}<br />
                Is Bot: {isBot ? 'Yes' : 'No'}<br />
                Retry Attempts: {retryAttempts}
              </div>
            )}
          </div>
        </>
      );
    };

    if (!isRetrying) {
      fetchJobData();
    }
  }, [error, retryAttempts, isRetrying]);

  if (isRetrying) {
    return (
      <div className="container mx-auto py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Reloading job details...</p>
        <p className="text-sm text-gray-500 mt-2">Attempt {retryAttempts + 1} of 3</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="container mx-auto py-12 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  return content;
};

const LocalExpiredJobPage = ({ job }: { job: JobFormData }) => {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-orange-800">
                Job Position Has Expired
              </h3>
              <div className="mt-2 text-sm text-orange-700">
                <p>This job posting is no longer accepting applications.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
          <h2 className="text-xl text-gray-600 mb-4">{job.company_name}</h2>
          
          <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-500">
            <span>📍 {job.city || 'Remote'}</span>
            <span>⏰ Expired on {new Date(job.expires_at).toLocaleDateString()}</span>
          </div>

          <div className="job-description prose max-w-none">
            <h3 className="text-lg font-semibold mb-3">Job Description Preview</h3>
            <MarkdownDisplay markdown={job.description.split('\n').slice(0, 3).join(' ') + '...'} />
            <p className="text-gray-500 italic mt-4">
              This is a preview of the expired job posting. The full description is no longer available.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="space-y-3">
              <a 
                href="/" 
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Browse Current Jobs
              </a>
              <div className="text-sm text-gray-500">
                <a href={`/jobs/city/${encodeURIComponent(job.city || 'remote')}`} className="text-blue-600 hover:underline">
                  View other jobs in {job.city || 'Remote positions'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobErrorBoundary;