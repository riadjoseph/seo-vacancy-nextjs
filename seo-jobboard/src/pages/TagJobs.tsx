import { useParams, useLoaderData, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import JobCard from "@/components/JobCard";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import Pagination from "@/components/Pagination";
import type { Job } from "@/data/types";

const JOBS_PER_PAGE = 7;
const origin = window.location.origin;
window.postMessage("message", origin);

const TagJobs = () => {
  const { tag } = useParams();
  const { jobs = [] } = useLoaderData() as { jobs: Job[] };
  const decodedTag = tag ? decodeURIComponent(tag).replace(/-/g, ' ') : '';
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  
  // Get unique cities and sort by frequency
  const cityFrequency = jobs.reduce((acc: Record<string, number>, job) => {
    if (job.city) {
      acc[job.city] = (acc[job.city] || 0) + 1;
    }
    return acc;
  }, {});
  
  const topCities = Object.entries(cityFrequency)
    .sort(([,a], [,b]) => b - a)
    .map(([city]) => city)
    .slice(0, 3);
  
  // Create canonical URL with hyphens and current page
  const canonicalUrl = `${window.location.origin}/jobs/tag/${decodedTag.replace(/\s+/g, '-').toLowerCase()}${currentPage > 1 ? `?page=${currentPage}` : ''}`;

  // Pagination logic
  const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE);
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const paginatedJobs = jobs.slice(startIndex, startIndex + JOBS_PER_PAGE);

  return (
    <div className="container py-8">
      <Helmet>
        <link rel="canonical" href={canonicalUrl} />
        <title>{`${jobs.length} jobs with ${decodedTag} skills required`}</title>
        <meta
          name="description"
          content={`${decodedTag} skills for companies in ${topCities.slice(0, 3).join(', ').replace(/,([^,]*)$/, ' and$1')}`}
        />
      </Helmet>
      
      <BreadcrumbNav
        items={[
          { label: "Jobs", href: "/" },
          { label: `Positions requiring "${decodedTag}"` }
        ]}
      />
      
      <h1 className="text-4xl font-bold mb-8">Positions requiring "{decodedTag}"</h1>
      
      {paginatedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paginatedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No positions found requiring "{decodedTag}".</p>
        </div>
      )}
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        createPageUrl={(page) => page === 1 
          ? `/jobs/tag/${encodeURIComponent(decodedTag.replace(/\s+/g, '-'))}` 
          : `/jobs/tag/${encodeURIComponent(decodedTag.replace(/\s+/g, '-'))}?page=${page}`
        }
      />
    </div>
  );
};

export default TagJobs;