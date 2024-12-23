import { Job } from "@/data/types";
import JobCard from "@/components/JobCard";
import { useNavigate } from "react-router-dom";

interface JobListingsProps {
  jobs: Job[];
  type: "featured" | "regular";
}

const JobListings = ({ jobs, type }: JobListingsProps) => {
  const navigate = useNavigate();

  const handleTagClick = (tag: string) => {
    navigate(`/jobs/tag/${encodeURIComponent(tag)}`);
  };

  return (
    <>
      {type === "featured" && jobs.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-6">Featured Jobs</h2>
          <div className="space-y-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} onTagClick={handleTagClick} />
            ))}
          </div>
        </>
      )}
      
      {type === "regular" && (
        <>
          <h2 className="text-2xl font-semibold mb-6">All Jobs</h2>
          <div className="space-y-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} onTagClick={handleTagClick} />
            ))}
          </div>
          
          {jobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No jobs found matching your criteria.</p>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default JobListings;