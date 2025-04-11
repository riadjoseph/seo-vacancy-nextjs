import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Star } from "lucide-react";
import type { Job } from "@/data/types";
import { useBookmark } from "@/hooks/useBookmark";
import { Link, useNavigate } from "react-router-dom";
import CompanyInfo from "./job/CompanyInfo";
import JobDetails from "./job/JobDetails";
import JobTags from "./job/JobTags";

interface JobCardProps {
  job: Job;
  onTagClick?: (tag: string) => void;
}

const createJobSlug = (title: string, company: string, city: string) => {
  const slug = `${title}-${company}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return slug;
};

const JobCard = ({ job, onTagClick }: JobCardProps) => {
  const { isBookmarked, toggleBookmark } = useBookmark();
  const navigate = useNavigate();
  const isExpired = new Date(job.expires_at) < new Date();
  const jobSlug = createJobSlug(job.title, job.company_name, job.city || 'Remote');

  // Ensure tags is an array and remove duplicates
  const uniqueTags = Array.from(new Set(job.tags || []));

  const handleTagClick = (tag: string) => {
    if (onTagClick) {
      onTagClick(tag);
    } else {
      navigate(`/jobs/tag/${tag}`);
    }
  };

  const handleViewJob = () => {
    // Scroll to top before navigating
    window.scrollTo(0, 0);
  };

  return (
    <Card 
      className={`p-6 hover:shadow-lg transition-all duration-300 ${
        isExpired ? 'opacity-75' : ''
      } ${
        job.featured ? 'border-2 border-blue-200 bg-blue-50/50' : ''
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          {job.company_logo && (
            <img src={job.company_logo} alt={job.company_name} className="w-12 h-12 rounded-lg" />
          )}
          <CompanyInfo job={job} isExpired={isExpired} />
        </div>
        <div className="flex items-center gap-2">
          {job.featured && (
            <span title="Featured" className="text-blue-600">
              <Star className="h-4 w-4" />
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              toggleBookmark(job.id);
            }}
            className={isBookmarked(job.id) ? "text-blue-600" : ""}
          >
            <Bookmark className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-gray-600 line-clamp-3">{job.description}</p>
      </div>
      
      {uniqueTags.length > 0 && <JobTags tags={uniqueTags} onTagClick={handleTagClick} />}
      
      <div className="mt-6">
        {isExpired ? (
          <Button className="w-full" disabled>
            Expired
          </Button>
        ) : (
          <Link to={`/job/${jobSlug}`} className="w-full" onClick={handleViewJob}>
            <Button className="w-full">
              <span className="truncate block">View {job.title}</span>
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
};

export default JobCard;