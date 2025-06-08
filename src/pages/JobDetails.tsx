import { useLoaderData } from "react-router-dom";
import { Helmet } from "react-helmet";
import { format } from "date-fns";
import JobHeader from "@/components/job/JobHeader";
import JobDetails from "@/components/job/JobDetails";
import CompanyInfo from "@/components/job/CompanyInfo";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import type { Job } from "@/data/types";
import useScrollTop from "@/hooks/useScrollTop";
import { useEffect } from "react";
import { createJobSlug } from "@/utils/jobUtils";

interface JobDetailsProps {
  job?: Job;
  isExpired?: boolean;
}

const JobDetailsPage = () => {
  const { job } = useLoaderData() as JobDetailsProps;
  
  // Use the scroll top hook
  useScrollTop();
  
  // Additional scroll-to-top effect when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  if (!job) {
    throw new Response("Not Found", { status: 404 });
  }

  const firstTag = job.tags?.[0] || "SEO";
  const formattedStartDate = job.start_date ? format(new Date(job.start_date), 'MMM d, yyyy') : 'flexible date';
  
  const breadcrumbItems = [
    { label: "Jobs", href: "/" },
    { label: job.title }
  ];
  
  const jobSlug = createJobSlug(job.title, job.company_name, job.city || "Remote");

  return (
    <>
      <Helmet>
        <title>{`${firstTag} job vacancy in ${job.city || 'Remote'} by ${job.company_name}`}</title>
        <meta 
          name="description" 
          content={`Vacancy for ${job.category} SEO role, at ${job.company_name}, starting ${formattedStartDate}. ${firstTag} skills required.`}
        />
        <link
          rel="canonical"
          href={`https://seo-vacancy.eu/job/${jobSlug}`}
        />
      </Helmet>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <BreadcrumbNav items={breadcrumbItems} />
        <JobHeader job={job} />
        <div className="mt-8 space-y-8">
          
          <JobDetails job={job} />
        </div>
      </div>
    </>
  );
};

export default JobDetailsPage;