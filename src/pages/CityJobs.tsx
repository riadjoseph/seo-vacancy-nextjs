import { useParams, useLoaderData } from "react-router-dom";
import { Helmet } from "react-helmet";
import JobCard from "@/components/JobCard";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import type { Job } from "@/data/types";
import { sortJobs } from "@/utils/jobSorting";

const CityJobs = () => {
  const { city } = useParams();
  const { jobs = [] } = useLoaderData() as { jobs: Job[] };
  
  // Get the first job's city name for proper capitalization display
  const displayCity = jobs[0]?.city || decodeURIComponent(city || '');
  const isRemote = displayCity.toLowerCase() === 'remote';
  
  // Get unique tags from all jobs and sort by frequency
  const tagFrequency = jobs.reduce((acc: Record<string, number>, job) => {
    job.tags?.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});
  
  const sortedTags = Object.entries(tagFrequency)
    .sort(([,a], [,b]) => b - a)
    .map(([tag]) => tag);
  
  const [firstTag, secondTag] = sortedTags;
  const activeJobsCount = jobs.length;
  
  return (
    <div className="container py-8">
      <Helmet>
        <title>
          {`SEO vacancies in ${displayCity} - ${firstTag || 'SEO'} and ${secondTag || 'Digital Marketing'} skills required`}
        </title>
        <meta
          name="description"
          content={`SEO roles available in ${displayCity} - ${activeJobsCount} jobs open.`}
        />
      </Helmet>
      
      <BreadcrumbNav
        items={[
          { label: "SEO Jobs", href: "/" },
          { label: isRemote ? "Remote SEO Jobs" : `SEO Jobs in ${displayCity}` }
        ]}
      />
      
      <h1 className="text-4xl font-bold mb-8">
        {isRemote ? "Remote SEO Jobs" : `SEO Jobs in ${displayCity}`}
      </h1>
      
      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortJobs(jobs).map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {isRemote 
              ? "No remote SEO jobs available at the moment."
              : `No SEO jobs found in ${displayCity}.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default CityJobs;