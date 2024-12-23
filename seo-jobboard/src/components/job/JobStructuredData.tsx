import { useEffect } from "react";
import type { Job } from "@/data/types";
import { CITIES_BY_COUNTRY } from "@/components/job-post/JobBasicInfo";

interface JobStructuredDataProps {
  job: Job;
}

const JobStructuredData = ({ job }: JobStructuredDataProps) => {
  useEffect(() => {
    const jobPostingStructuredData = {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      title: job.title,
      description: job.description,
      datePosted: job.posted_date,
      validThrough: job.expires_at,
      hiringOrganization: {
        "@type": "Organization",
        name: job.company_name,
        logo: job.company_logo || undefined,
      },
      ...(job.city ? {
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: job.city,
            addressCountry: job.city === "Remote" ? undefined : 
              Object.entries(CITIES_BY_COUNTRY as unknown as Record<string, string[]>).find(([_, cities]) => 
                cities.includes(job.city as string)
              )?.[0],
          },
        },
      } : {
        jobLocationType: "TELECOMMUTE"
      }),
      ...(job.hide_salary ? {} : {
        baseSalary: {
          "@type": "MonetaryAmount",
          currency: job.salary_currency || "EUR",
          value: {
            "@type": "QuantitativeValue",
            minValue: job.salary_min,
            maxValue: job.salary_max,
            unitText: "YEAR"
          }
        },
      }),
      employmentType: "FULL_TIME",
      industry: job.category,
      occupationalCategory: job.tags?.join(", "),
      applicationUrl: job.job_url
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify(jobPostingStructuredData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [job]);

  return null;
};

export default JobStructuredData;