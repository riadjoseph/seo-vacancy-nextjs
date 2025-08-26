import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { JobCard } from '@/components/JobCard'
import { JobCardSkeleton } from '@/components/JobCardSkeleton'
import { AdvancedSearch } from '@/components/AdvancedSearch'

interface JobsListProps {
  searchParams: {
    q?: string
    category?: string
    city?: string
    tags?: string[]
  }
}

async function JobsList({ searchParams }: JobsListProps) {
  const supabase = await createClient()
  
  let query = supabase
    .from('jobs')
    .select('*')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(50)

  // Filter out expired jobs
  const currentDate = new Date().toISOString()
  query = query.or(`expires_at.is.null,expires_at.gte.${currentDate}`)

  // Apply filters based on search params
  if (searchParams.q) {
    const searchTerm = searchParams.q.trim()
    query = query.or(`title.ilike.%${searchTerm}%,company_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
  }
  
  if (searchParams.category) {
    query = query.eq('category', searchParams.category)
  }
  
  if (searchParams.city) {
    query = query.eq('city', searchParams.city)
  }
  
  if (searchParams.tags && searchParams.tags.length > 0) {
    const tags = Array.isArray(searchParams.tags) ? searchParams.tags : [searchParams.tags]
    query = query.contains('tags', tags)
  }

  const { data: jobs, error } = await query

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
              <JobCard key={job.id} job={job} isFeatured={true} />
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

interface HomeProps {
  searchParams: Promise<{
    q?: string
    category?: string
    city?: string
    tags?: string | string[]
  }>
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams
  // Normalize tags to always be an array
  const normalizedSearchParams = {
    ...params,
    tags: params.tags ? (Array.isArray(params.tags) ? params.tags : [params.tags]) : undefined
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
          Wake Up To Your Dream Career
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Start each day with excitement! Discover the latest SEO, marketing, and tech job opportunities across Europe
        </p>
      </div>

      <AdvancedSearch />

      <Suspense fallback={<LoadingSkeleton />}>
        <JobsList searchParams={normalizedSearchParams} />
      </Suspense>
    </div>
  )
}