import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import type { Job } from "@/data/types";

interface CompanyInfoProps {
  job: Job;
  isExpired?: boolean;
}

const createJobSlug = (title: string, company: string, city: string) => {
  const slug = `${title}-${company}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return slug;
};

const CompanyInfo = ({ job, isExpired }: CompanyInfoProps) => {
  const jobSlug = createJobSlug(job.title, job.company_name, job.city || 'Remote');

  return (
    <div>
      {isExpired ? (
        <h3 className="font-semibold text-lg text-gray-600">{job.title}</h3>
      ) : (
        <Link to={`/job/${jobSlug}`}>
          <h3 className="font-semibold text-lg hover:text-blue-600">{job.title}</h3>
        </Link>
      )}
      <p className="text-gray-600">{job.company_name}</p>
      {job.city && (
        <Link 
          to={`/jobs/city/${encodeURIComponent(job.city.toLowerCase())}`}
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline cursor-pointer"
        >
          <MapPin className="h-4 w-4" />
          {job.city}
        </Link>
      )}
    </div>
  );
};

export default CompanyInfo;