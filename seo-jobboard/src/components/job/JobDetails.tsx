import { Link } from "react-router-dom";
import type { Job } from "@/data/types";
import JobTags from "./JobTags";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import JobStructuredData from "./JobStructuredData";
import JobSalaryInfo from "./JobSalaryInfo";
import JobDatesInfo from "./JobDatesInfo";

interface JobDetailsProps {
  job: Job;
}

const JobDetails = ({ job }: JobDetailsProps) => {
  const handleTagClick = (tag: string) => {
    const urlTag = tag.replace(/\s+/g, '-').toLowerCase();
    return `/jobs/tag/${encodeURIComponent(urlTag)}`;
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

      <div className="prose max-w-none mt-8">
        <h2 className="text-xl font-semibold mb-4">Job Description</h2>
        <p className="whitespace-pre-wrap">{job.description}</p>
      </div>

      <div className="mt-8">
        <a href={job.job_url} target="_blank" rel="noopener noreferrer">
          <Button className="w-full">Apply Now</Button>
        </a>
      </div>
    </div>
  );
};

export default JobDetails;