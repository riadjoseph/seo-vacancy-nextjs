// import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { JobCard } from '@/components/JobCard'
import { MobileAdvancedSearch } from '@/components/MobileAdvancedSearch'
import { ServerPagination, ServerPaginationSummary } from '@/components/ui/server-pagination'
import { ArrowLeft, MapPin } from 'lucide-react'
import { calculatePagination } from '@/utils/pagination'

// Route Segment Config - 24 hour revalidation
export const revalidate = 86400 // 24 hours

interface CityJobsPageProps {
  params: Promise<{
    city: string
  }>
  searchParams: Promise<{
    page?: string
    cache?: string
  }>
}

async function getCityJobs(city: string, page: number = 1) {
  const supabase = await createClient()
  const decodedCity = decodeURIComponent(city).toLowerCase()
  const itemsPerPage = 25
  const offset = (page - 1) * itemsPerPage

  // Count total jobs
  const { count, error: countError } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .ilike('city', decodedCity)

  if (countError) {
    console.error('Error counting city jobs:', countError)
    return { jobs: null, totalCount: 0 }
  }

  // Get paginated jobs
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
    .ilike('city', decodedCity)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .range(offset, offset + itemsPerPage - 1)
  
  if (error) {
    console.error('Error fetching city jobs:', error)
    return { jobs: null, totalCount: count || 0 }
  }
  
  return { jobs, totalCount: count || 0 }
}

export async function generateMetadata({ params, searchParams }: CityJobsPageProps): Promise<Metadata> {
  const { city } = await params
  const { page } = await searchParams
  const currentPage = Math.max(1, parseInt(page || '1', 10) || 1)
  const decodedCity = decodeURIComponent(city)
  const { totalCount } = await getCityJobs(city, 1) // Get count from first page
  
  const pageTitle = currentPage > 1 ? ` - Page ${currentPage}` : ''
  
  if (totalCount === 0) {
    return {
      title: `No Jobs in ${decodedCity} | Job Board`,
      description: `No job opportunities found in ${decodedCity}. Check back later for new positions.`
    }
  }
  
  return {
    title: `${totalCount} Jobs in ${decodedCity}${pageTitle} | Job Board`,
    description: `Discover ${totalCount} SEO and tech job opportunities in ${decodedCity}. Find your perfect career match today.`,
    openGraph: {
      title: `Jobs in ${decodedCity}${pageTitle}`,
      description: `${totalCount} job opportunities available in ${decodedCity}`,
    },
  }
}

async function CityJobsList({ city, page }: { city: string; page: number }) {
  const { jobs, totalCount } = await getCityJobs(city, page)
  const decodedCity = decodeURIComponent(city)
  const paginationData = calculatePagination(page, totalCount, 25)
  
  if (!jobs) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">Failed to load jobs. Please try again later.</p>
      </div>
    )
  }
  
  if (totalCount === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          No jobs found in {decodedCity}
        </h2>
        <p className="text-gray-600 mb-6">
          We don't have any job listings for {decodedCity} right now.
        </p>
        <Link href="/">
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
            Browse All Jobs
          </button>
        </Link>
      </div>
    )
  }
  
  const featuredJobs = jobs?.filter(job => job.featured) || []
  const regularJobs = jobs?.filter(job => !job.featured) || []
  
  return (
    <>
      {/* Results summary */}
      <div className="flex justify-between items-center mb-6">
        <ServerPaginationSummary data={paginationData} />
      </div>

      {/* Featured Jobs (only show on first page) */}
      {featuredJobs.length > 0 && page === 1 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Jobs in {decodedCity}</h2>
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
          {featuredJobs.length > 0 ? `All Jobs in ${decodedCity}` : `Jobs in ${decodedCity}`}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {regularJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
      
      {/* Pagination */}
      <div className="flex justify-center">
        <ServerPagination data={paginationData} basePath={`/jobs/city/${city}`} />
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-600">
        <p>
          Found {jobs.length} job{jobs.length !== 1 ? 's' : ''} in {decodedCity}
        </p>
      </div>
    </>
  )
}


export default async function CityJobsPage({ params, searchParams }: CityJobsPageProps) {
  const { city } = await params
  const { page, cache } = await searchParams
  
  // Check for cache purge parameter
  if (cache === 'purge') {
    // Prepare clean URL
    const cleanUrl = page ? `/jobs/city/${city}?page=${page}` : `/jobs/city/${city}`
    
    // Redirect to cache purge API with redirect URL
    const { redirect } = await import('next/navigation')
    redirect(`/api/cache-purge/jobs/city/${city}?redirect=${encodeURIComponent(cleanUrl)}`)
  }
  
  const currentPage = Math.max(1, parseInt(page || '1', 10) || 1)
  const decodedCity = decodeURIComponent(city)
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4" />
          Back to All Jobs
        </Link>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-6 w-6 text-gray-600" />
          <h1 className="text-3xl font-bold">Jobs in {decodedCity}</h1>
        </div>
        <p className="text-gray-600">
          Discover SEO and tech job opportunities in {decodedCity}
        </p>
      </div>
      
      <MobileAdvancedSearch 
        initialValues={{ city: decodedCity }}
      />
      
      <CityJobsList city={city} page={currentPage} />
    </div>
  )
}