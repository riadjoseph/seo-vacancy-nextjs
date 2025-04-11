import { Link } from "react-router-dom";
import type { Job } from "@/data/types";
import JobTags from "./JobTags";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import JobStructuredData from "./JobStructuredData";
import JobSalaryInfo from "./JobSalaryInfo";
import JobDatesInfo from "./JobDatesInfo";
import { trackEvent } from '@/utils/analytics';
import MarkdownDisplay from '@/MarkdownDisplay';

interface JobDetailsProps {
  job: Job;
}

const JobDetails = ({ job }: JobDetailsProps) => {
  const handleTagClick = (tag: string) => {
    const urlTag = tag.replace(/\s+/g, '-').toLowerCase();
    return `/jobs/tag/${encodeURIComponent(urlTag)}`;
  };

  const handleApplyClick = () => {
    trackEvent('job_apply_click', {
      job_id: job.id,
      job_title: job.title,
      company: job.company_name,
    });
  };

  const getFormattedJobUrl = (rawUrl: string) => {
    try {
      const parsed = new URL(rawUrl);
      const isLinkedInDomain = parsed.hostname.endsWith('linkedin.com');

      if (isLinkedInDomain) {
        const jobIdMatch = parsed.pathname.match(/\/jobs\/view\/([^\/\?]+)/);
        if (jobIdMatch && jobIdMatch[1]) {
          const jobId = jobIdMatch[1];
          const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
          const isAndroid = /Android/.test(navigator.userAgent);
          const iosAppUrl = `linkedin://jobs/view/${jobId}`;
          const androidAppUrl = `linkedin://company-jobs/view?jobId=${jobId}`;
          return isIOS ? iosAppUrl : (isAndroid ? androidAppUrl : rawUrl);
        }
      }

      return rawUrl;
    } catch (err) {
      return rawUrl;
    }
  };

  return (
    <div>
      <JobStructuredData job={job} />
      
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {job.city && (
          <Link
            to={`/jobs/city/${encodeURIComponent(job.city.toLowerCase())}`}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-md hover:bg-gray-50"
          >
            <MapPin className="h-4 w-4" />
            {job.city}
          </Link>
        )}
        {job.tags && job.tags.length > 0 && (
          <JobTags tags={job.tags} onTagClick={handleTagClick} />
        )}
      </div>

      <JobDatesInfo job={job} />
      <JobSalaryInfo job={job} />

      <div className="mt-8">
        <a 
          href={getFormattedJobUrl(job.job_url)} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={(e) => {
            handleApplyClick();
            if (!job.job_url.includes('linkedin.com')) return;
            const formattedUrl = getFormattedJobUrl(job.job_url);
            const fallbackUrl = job.job_url;
            const isAndroid = /Android/.test(navigator.userAgent);
            const delay = isAndroid ? 750 : 500;
            window.location.href = formattedUrl;
            setTimeout(() => {
              window.location.href = fallbackUrl;
            }, delay);
            e.preventDefault();
          }}
        >
          <Button className="w-full font-bold bg-[#1d49fb] hover:bg-[#1d49fb]/90">APPLY NOW</Button>
        </a>
      </div>
      <div className="prose max-w-none mt-8">
        <h2 className="text-xl font-semibold mb-4">Job Description</h2>
        <div className="job-description">
          <MarkdownDisplay markdown={job.description} />
        </div>
      </div>

      <div className="mt-8">
        <a 
          href={getFormattedJobUrl(job.job_url)} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={(e) => {
            handleApplyClick();
            if (!job.job_url.includes('linkedin.com')) return;
            const formattedUrl = getFormattedJobUrl(job.job_url);
            const fallbackUrl = job.job_url;
            const isAndroid = /Android/.test(navigator.userAgent);
            const delay = isAndroid ? 750 : 500;
            window.location.href = formattedUrl;
            setTimeout(() => {
              window.location.href = fallbackUrl;
            }, delay);
            e.preventDefault();
          }}
        >
          <Button className="w-full font-bold bg-[#1d49fb] hover:bg-[#1d49fb]/90">APPLY NOW</Button>
        </a>
      </div>
    </div>
  );
};

export default JobDetails;