import type { Job } from "@/data/types";

interface JobSalaryInfoProps {
  job: Job;
}

const JobSalaryInfo = ({ job }: JobSalaryInfoProps) => {
  const formatSalary = (min: number | null, max: number | null, currency: string) => {
    if (job.hide_salary) return null;
    if (!min && !max) return null;
    if (!max) return `${currency}${min?.toLocaleString()}+`;
    if (!min) return `Up to ${currency}${max?.toLocaleString()}`;
    return `${currency}${min?.toLocaleString()} - ${currency}${max?.toLocaleString()}`;
  };

  const salary = formatSalary(job.salary_min, job.salary_max, job.salary_currency || '€');
  if (!salary) return null;

  return (
    <p className="text-xl font-semibold mb-4">
    {salary}
    </p>
  );
};

export default JobSalaryInfo;