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
  const formattedCategory = job.category ? job.category.toLowerCase().replace(/_/g, ' ') : '';

  // slug for city listings
  const citySlug = job.city?.toLowerCase().replace(/\s+/g, '-') || 'remote';

  const breadcrumbItems = [
    { label: "Jobs", href: "/" },
    { label: `SEO Jobs in ${job.city}`, href: `/jobs/city/${citySlug}` },
    { label: job.title }
  ];

  const jobSlug = createJobSlug(job.title, job.company_name, job.city || "Remote");

  return (
    <>
      <Helmet>
        <title>{`SEO Job - ${job.title} - ${job.city} by ${job.company_name}`} | SEO-Vacancy.eu</title>
        <meta 
          name="description" 
          content={`Got ${firstTag} skills? ${formattedCategory} SEO Job at ${job.company_name}, ${job.city}. Apply now!`}
        />
        <link
          rel="canonical"
          href={`https://seo-vacancy.eu/job/${jobSlug}`}
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Jobs", item: "https://seo-vacancy.eu/" },
              { "@type": "ListItem", position: 2, name: `SEO Jobs in ${job.city}`, item: `https://seo-vacancy.eu/jobs/city/${citySlug}` },
              { "@type": "ListItem", position: 3, name: job.title, item: `https://seo-vacancy.eu/job/${jobSlug}` }
            ]
          })}
        </script>
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