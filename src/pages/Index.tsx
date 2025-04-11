import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SecondaryMenu from "@/components/SecondaryMenu";
import BrandingHeader from "@/components/BrandingHeader";
import JobCardSkeleton from "@/components/JobCardSkeleton";
import ErrorState from "@/components/ErrorState";
import SearchSection from "@/components/search/SearchSection";
import IndexPageMeta from "@/components/meta/IndexPageMeta";
import Footer from "@/components/Footer";
import Pagination from "@/components/Pagination";
import { useSearchParams } from "react-router-dom";
import type { Job } from "@/data/types";
import JobCard from "@/components/JobCard";
import { sortJobs } from "@/utils/jobSorting";
import { trackEvent } from '@/utils/analytics';
import useScrollTop from "@/hooks/useScrollTop";

const JOBS_PER_PAGE = 25;

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const jobsRef = useRef<HTMLDivElement>(null);

  const { data: jobs = [], isLoading, error, refetch } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase.from("jobs").select("*");
      if (error) throw error;
      return data || [];
    }
  });

  const normalizeText = (text: string) => text.toLowerCase().trim();

  const filteredJobs = sortJobs(jobs
    .filter((job) => {
      if (selectedCity && job.city !== selectedCity) {
        return false;
      }

      if (searchQuery.trim()) {
        const searchTerms = searchQuery.toLowerCase().split(' ');
        
        const searchableText = [
          job.title,
          job.company_name,
          job.description,
          job.category,
          job.city,
          ...(job.tags || [])
        ]
        .filter(Boolean)
        .map(text => normalizeText(String(text)))
        .join(' ');

        return searchTerms.every(term => {
          const normalizedTerm = normalizeText(term);
          return searchableText.includes(normalizedTerm);
        });
      }

      return true;
    }));

  // Reset to base URL when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setSearchParams({});  // Remove all params to get back to base URL
    }
  }, [searchQuery, selectedCity]);

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + JOBS_PER_PAGE);
  
  const featuredJobs = paginatedJobs.filter(job => job.featured);
  const regularJobs = paginatedJobs.filter(job => !job.featured);

  const createPageUrl = (page: number) => {
    return page === 1 ? "/" : `/?page=${page}`;
  };

  const getJobsHeading = () => {
    if (selectedCity) {
      return `All Jobs in ${selectedCity}`;
    }
    return "All Jobs";
  };

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollPercent = 
          (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        
        if (scrollPercent >= 25) {
          trackEvent('scroll_depth', {
            depth: '25%',
            page: 'job_listings',
          });
        }
        if (scrollPercent >= 50) {
          trackEvent('scroll_depth', {
            depth: '50%',
            page: 'job_listings',
          });
        }
        if (scrollPercent >= 75) {
          trackEvent('scroll_depth', {
            depth: '75%',
            page: 'job_listings',
          });
        }
        if (scrollPercent >= 90) {
          trackEvent('scroll_depth', {
            depth: '90%',
            page: 'job_listings',
          });
        }
      }, 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Use the scroll top hook
  useScrollTop();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="container py-8 flex-grow">
          <BrandingHeader />
          <SearchSection 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            jobs={[]}
          />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <JobCardSkeleton key={n} />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="container py-8 flex-grow">
          <BrandingHeader />
          <ErrorState onRetry={() => refetch()} />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <IndexPageMeta />
      <div className="container py-8 flex-grow">
        <BrandingHeader />
        
        <SearchSection 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          jobs={jobs}
        />

        <SecondaryMenu
          selectedCity={selectedCity}
          onSelectCity={setSelectedCity}
          jobs={jobs}
        />
        
        <div className="mt-8" ref={jobsRef}>
          {featuredJobs.length > 0 && (
            <>
              <h2 className="text-2xl font-semibold mb-6">Featured Jobs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {featuredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </>
          )}
          
          <h2 className="text-2xl font-semibold mb-6">{getJobsHeading()}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {regularJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          
          {regularJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No jobs found matching your criteria.</p>
            </div>
          )}
        </div>

        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          createPageUrl={createPageUrl}
        />
      </div>
      
    </div>
  );
};

export default Index;
