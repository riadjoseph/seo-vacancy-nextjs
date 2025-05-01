import { format } from "date-fns";
import type { Job } from "@/data/types";

interface JobDatesInfoProps {
  job: Job;
}

const JobDatesInfo = ({ job }: JobDatesInfoProps) => {
  return (
    <>
      {job.posted_date && (
        <p className="text-gray-600 mb-2">
          Posted: {format(new Date(job.posted_date), 'MMM d, yyyy')}
        </p>
      )}

      {/* {job.start_date && (
        <p className="text-gray-600 mb-2">
          Start date: {format(new Date(job.start_date), 'MMM d, yyyy')}
        </p>
      )} */}
    </>
  );
};

export default JobDatesInfo;