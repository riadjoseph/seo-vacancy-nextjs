import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookmark } from "@/hooks/useBookmark";
import type { Job } from "@/data/types";

interface JobHeaderProps {
  job: Job;
}

const JobHeader = ({ job }: JobHeaderProps) => {
  const { isBookmarked, toggleBookmark } = useBookmark();

  return (
    <div className="flex justify-between items-start mb-6">
      <div className="flex items-center gap-4">
        {job.company_logo && (
          <img 
            src={job.company_logo} 
            alt={job.company_name} 
            className="w-8 h-8 md:w-8 md:h-8 rounded-lg" // Made responsive
          />
        )}
        <div>
          <h1 className="text-xl md:text-2xl font-bold">{job.title} {job.city}</h1>
          <p className="text-lg md:text-xl text-gray-600">{job.company_name}</p>
        </div>
      </div>
      <Button
        variant="outline"
        onClick={() => toggleBookmark(job.id)}
        className={`-mt-1 ${isBookmarked(job.id) ? "bg-yellow-400 border-yellow-400 hover:bg-yellow-500 hover:border-yellow-500" : ""}`}
      >
        <Bookmark className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default JobHeader;