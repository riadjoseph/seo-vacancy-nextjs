import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { JobCard } from '@/components/JobCard'
import { MobileAdvancedSearch } from '@/components/MobileAdvancedSearch'
import { Badge } from '@/components/ui/badge'
import { ServerPagination, ServerPaginationSummary } from '@/components/ui/server-pagination'
import { ArrowLeft, Tag } from 'lucide-react'
import { parseTagFromSlug } from '@/utils/tagUtils'
import { calculatePagination } from '@/utils/pagination'

// Route Segment Config - 24 hour revalidation
export const revalidate = 86400 // 24 hours

interface TagJobsPageProps {
  params: Promise<{
    tag: string
  }>
  searchParams: Promise<{
    page?: string
    cache?: string
  }>
}

function normalizeTag(tag: string): string {
  return tag.toLowerCase().replace(/-/g, ' ')
}

async function getTagJobs(tag: string, page: number = 1) {
  const supabase = await createClient()
  const targetTag = parseTagFromSlug(tag)
  const itemsPerPage = 25
  const offset = (page - 1) * itemsPerPage

  // Valid enum values for seo_specialization
  const validEnumValues = [
    "Technical SEO",
    "Content SEO", 
    "Local SEO",
    "E-commerce SEO",
    "International SEO",
    "Enterprise SEO",
    "Link Building",
    "SEO Strategy & Management",
    "Analytics & Data SEO"
  ]

  // If the target tag is a valid enum value, search in tags column
  // Otherwise search in title, description, category, and company fields
  let query = supabase.from('jobs').select('*')
  
  if (validEnumValues.includes(targetTag)) {
    query = query.contains('tags', [targetTag])
  } else {
    // Search in text fields for non-enum tags like "Marketing", "JavaScript"
    const searchFilter = `title.ilike.%${targetTag}%,company_name.ilike.%${targetTag}%,description.ilike.%${targetTag}%,category.ilike.%${targetTag}%`
    query = query.or(searchFilter)
  }

  const { data: allJobs, error: allError } = await query
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })

  if (allError) {
    console.error('Error fetching tag jobs:', allError)
    return { jobs: null, totalCount: 0 }
  }

  // Filter out expired jobs
  const currentDate = new Date().toISOString()
  const activeJobs = allJobs?.filter(job => 
    !job.expires_at || new Date(job.expires_at).getTime() > new Date(currentDate).getTime()
  ) || []

  // Paginate the results
  const paginatedJobs = activeJobs.slice(offset, offset + itemsPerPage)
  
  return {
    jobs: paginatedJobs,
    totalCount: activeJobs.length
  }
}

export async function generateMetadata({ params, searchParams }: TagJobsPageProps): Promise<Metadata> {
  const { tag } = await params
  const { page } = await searchParams
  const currentPage = Math.max(1, parseInt(page || '1', 10) || 1)
  const tagName = parseTagFromSlug(tag)
  const { totalCount } = await getTagJobs(tag, 1) // Get count from first page
  
  const pageTitle = currentPage > 1 ? ` - Page ${currentPage}` : ''
  
  if (totalCount === 0) {
    return {
      title: `No ${tagName} Jobs | Job Board`,
      description: `No job opportunities found for ${tagName}. Check back later for new positions.`
    }
  }
  
  return {
    title: `${totalCount} ${tagName} Jobs${pageTitle} | Job Board`,
    description: `Discover ${totalCount} ${tagName} job opportunities. Find your perfect career match in ${tagName}.`,
    openGraph: {
      title: `${tagName} Jobs${pageTitle}`,
      description: `${totalCount} job opportunities available for ${tagName}`,
    },
  }
}

async function TagJobsList({ tag, page }: { tag: string; page: number }) {
  const { jobs, totalCount } = await getTagJobs(tag, page)
  const tagName = parseTagFromSlug(tag)
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
        <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          No {tagName} jobs found
        </h2>
        <p className="text-gray-600 mb-6">
          We don't have any job listings tagged with "{tagName}" right now.
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
          <h2 className="text-2xl font-bold mb-6">Featured {tagName} Jobs</h2>
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
          {page === 1 && featuredJobs.length > 0 ? `All ${tagName} Jobs` : `${tagName} Jobs`}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(page === 1 ? regularJobs : jobs).map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <ServerPagination data={paginationData} basePath={`/jobs/tag/${tag}`} />
      </div>
    </>
  )
}


export default async function TagJobsPage({ params, searchParams }: TagJobsPageProps) {
  const { tag } = await params
  const { page, cache } = await searchParams
  
  // Check for cache purge parameter
  if (cache === 'purge') {
    // Prepare clean URL
    const cleanUrl = page ? `/jobs/tag/${tag}?page=${page}` : `/jobs/tag/${tag}`
    
    // Redirect to cache purge API with redirect URL
    const { redirect } = await import('next/navigation')
    redirect(`/api/cache-purge/jobs/tag/${tag}?redirect=${encodeURIComponent(cleanUrl)}`)
  }
  
  const currentPage = Math.max(1, parseInt(page || '1', 10) || 1)
  const tagName = parseTagFromSlug(tag)
  
  // Check for spaces in tag (not allowed in slug format)
  if (tag.includes(' ') || tag.includes('%20')) {
    notFound()
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4" />
          Back to All Jobs
        </Link>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Tag className="h-6 w-6 text-gray-600" />
          <h1 className="text-3xl font-bold">{tagName} Jobs</h1>
          <Badge variant="secondary" className="text-sm">
            {tagName}
          </Badge>
        </div>
        <p className="text-gray-600">
          Browse all job opportunities related to {tagName}
        </p>
      </div>
      
      <MobileAdvancedSearch 
        initialValues={{ tag }}
      />
      
      <TagJobsList tag={tag} page={currentPage} />
    </div>
  )
}