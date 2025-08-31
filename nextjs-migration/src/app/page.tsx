import { createClient } from '@/lib/supabase/server'
import { JobCard } from '@/components/JobCard'
import { MobileAdvancedSearch } from '@/components/MobileAdvancedSearch'
import { ServerPagination, ServerPaginationSummary } from '@/components/ui/server-pagination'
import { calculatePagination } from '@/utils/pagination'

// Route Segment Config - 24 hour revalidation
export const revalidate = 86400 // 24 hours

interface JobsListProps {
  searchParams: {
    q?: string
    category?: string
    city?: string
    tags?: string[]
    page?: string
  }
}

async function JobsList({ searchParams }: JobsListProps) {
  // Normalize tags to always be an array for this component
  const normalizedSearchParams = {
    ...searchParams,
    tags: searchParams.tags ? (Array.isArray(searchParams.tags) ? searchParams.tags : [searchParams.tags]) : undefined
  }
  
  const supabase = await createClient()
  const currentPage = Math.max(1, parseInt(searchParams.page || '1', 10) || 1)
  const itemsPerPage = 25
  const offset = (currentPage - 1) * itemsPerPage

  // Base query for counting total items
  let countQuery = supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })

  // Base query for fetching jobs
  let dataQuery = supabase
    .from('jobs')
    .select('*')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .range(offset, offset + itemsPerPage - 1)

  // Filter out expired jobs
  const currentDate = new Date().toISOString()
  const expiredFilter = `expires_at.is.null,expires_at.gte.${currentDate}`
  countQuery = countQuery.or(expiredFilter)
  dataQuery = dataQuery.or(expiredFilter)

  // Apply filters based on search params
  if (normalizedSearchParams.q) {
    const searchTerm = normalizedSearchParams.q.trim()
    const searchFilter = `title.ilike.%${searchTerm}%,company_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`
    countQuery = countQuery.or(searchFilter)
    dataQuery = dataQuery.or(searchFilter)
  }
  
  if (normalizedSearchParams.category) {
    countQuery = countQuery.eq('category', normalizedSearchParams.category)
    dataQuery = dataQuery.eq('category', normalizedSearchParams.category)
  }
  
  if (normalizedSearchParams.city) {
    countQuery = countQuery.eq('city', normalizedSearchParams.city)
    dataQuery = dataQuery.eq('city', normalizedSearchParams.city)
  }
  
  if (normalizedSearchParams.tags && normalizedSearchParams.tags.length > 0) {
    const tags = Array.isArray(normalizedSearchParams.tags) ? normalizedSearchParams.tags : [normalizedSearchParams.tags]
    countQuery = countQuery.contains('tags', tags)
    dataQuery = dataQuery.contains('tags', tags)
  }

  // Execute both queries
  const [{ data: jobs, error }, { count }] = await Promise.all([
    dataQuery,
    countQuery
  ])

  // Calculate pagination data
  const paginationData = calculatePagination(currentPage, count || 0, itemsPerPage)

  if (!jobs?.length) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <ServerPaginationSummary data={paginationData} />
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No jobs found.</p>
        </div>
      </div>
    )
  }

  const featuredJobs = jobs.filter(job => job.featured)
  const regularJobs = jobs.filter(job => !job.featured)

  return (
    <>
      {/* Results summary */}
      <div className="flex justify-between items-center mb-6">
        <ServerPaginationSummary data={paginationData} />
      </div>

      {/* Featured Jobs (only show on first page for clean pagination) */}
      {featuredJobs.length > 0 && currentPage === 1 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} isFeatured={true} />
            ))}
          </div>
        </div>
      )}

      {/* All Jobs */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">
          {currentPage === 1 && featuredJobs.length > 0 ? 'All Jobs' : 'Jobs'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(currentPage === 1 ? regularJobs : jobs).map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <ServerPagination data={paginationData} basePath="/" searchParams={searchParams} />
      </div>
    </>
  )
}


interface HomeProps {
  searchParams: Promise<{
    q?: string
    category?: string
    city?: string
    tags?: string | string[]
    page?: string
    cache?: string
  }>
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams
  
  // Check for cache purge parameter
  if (params.cache === 'purge') {
    // Prepare clean URL without cache parameter
    const cleanParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (key !== 'cache' && value) {
        if (Array.isArray(value)) {
          value.forEach(v => cleanParams.append(key, v))
        } else {
          cleanParams.set(key, value)
        }
      }
    })
    const redirectUrl = cleanParams.toString() ? `/?${cleanParams.toString()}` : '/'
    
    // Redirect to cache purge API with redirect URL
    const { redirect } = await import('next/navigation')
    redirect(`/api/cache-purge?redirect=${encodeURIComponent(redirectUrl)}`)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">An SEO Job That You'll Like
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Start each day with excitement! Discover the latest SEO, marketing, and tech job opportunities across Europe
        </p>
      </div>

      <MobileAdvancedSearch initialValues={params} />

      <JobsList searchParams={{
        ...params,
        tags: params.tags ? (Array.isArray(params.tags) ? params.tags : [params.tags]) : undefined
      }} />
    </div>
  )
}