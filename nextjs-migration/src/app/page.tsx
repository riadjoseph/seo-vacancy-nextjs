import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { JobCard } from '@/components/JobCard'
import { JobCardSkeleton } from '@/components/JobCardSkeleton'

async function JobsList() {
  const supabase = await createClient()
  
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Error fetching jobs:', error)
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">Failed to load jobs. Please try again later.</p>
      </div>
    )
  }

  if (!jobs?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No jobs found.</p>
      </div>
    )
  }

  const featuredJobs = jobs.filter(job => job.featured)
  const regularJobs = jobs.filter(job => !job.featured)

  return (
    <>
      {featuredJobs.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-6">All Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {regularJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </>
  )
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Find Your Next SEO & Tech Career
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover the latest SEO, marketing, and tech job opportunities across Europe
        </p>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <JobsList />
      </Suspense>
    </main>
  )
}