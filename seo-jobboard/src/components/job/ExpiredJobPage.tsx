import { Link } from "react-router-dom";
import { AlertOctagon, MapPin, ArrowLeft } from "lucide-react";
import type { Job } from "@/data/types";

interface ExpiredJobPageProps {
  job: Job;
}

const ExpiredJobPage = ({ job }: ExpiredJobPageProps) => {
  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <div className="text-center space-y-6">
        {/* Animated SVG */}
        <div className="relative w-24 h-24 mx-auto animate-bounce">
          <AlertOctagon className="w-24 h-24 text-gray-400" />
          <div className="absolute inset-0 animate-ping">
            <AlertOctagon className="w-24 h-24 text-gray-400 opacity-75" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Job Posting Expired</h1>
          <p className="text-xl text-gray-600">
            Sorry, this {job.title} position at {job.company_name} is no longer available.
          </p>
        </div>

        {job.city && (
          <div className="mt-8">
            <Link
              to={`/jobs/city/${encodeURIComponent(job.city.toLowerCase())}`}
              className="inline-flex items-center gap-2 text-primary hover:text-primary-hover transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span>View other jobs in</span>
              <div className="inline-flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{job.city}</span>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpiredJobPage;