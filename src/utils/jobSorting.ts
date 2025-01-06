import type { Job } from "@/data/types";

export const sortJobs = (jobs: Job[]) => {
  const currentDate = new Date();
  
  return jobs.sort((a, b) => {
    // First check if jobs are expired
    const aExpired = new Date(a.expires_at) < currentDate;
    const bExpired = new Date(b.expires_at) < currentDate;
    
    if (aExpired !== bExpired) {
      return aExpired ? 1 : -1; // Expired jobs go last
    }
    
    // Then check featured status (only for non-expired jobs)
    if (!aExpired && !bExpired && a.featured !== b.featured) {
      return a.featured ? -1 : 1; // Featured jobs go first
    }
    
    // Finally sort by creation date
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}; 