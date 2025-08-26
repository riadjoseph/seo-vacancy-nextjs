import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { JobCard } from '@/components/JobCard'
import { JobCardSkeleton } from '@/components/JobCardSkeleton'
import { SearchSection } from '@/components/SearchSection'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Tag } from 'lucide-react'
import { parseTagFromSlug, createTagSlug } from '@/utils/tagUtils'

interface TagJobsPageProps {
  params: Promise<{
    tag: string
  }>
}

function normalizeTag(tag: string): string {
  return tag.toLowerCase().replace(/-/g, ' ')
}

async function getTagJobs(tag: string) {
  const supabase = await createClient()
  const targetTag = parseTagFromSlug(tag)
  
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
  
  if (error) {
    console.error('Error fetching tag jobs:', error)
    return null
  }
  
  // Filter jobs by tag (exact match)
  const filteredJobs = jobs?.filter(job => 
    job.tags?.some((jobTag: string) => 
      jobTag === targetTag
    )
  )
  
  return filteredJobs?.sort((a, b) => {
    // Sort by featured first, then by creation date
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
  }) || []
}

export async function generateMetadata({ params }: TagJobsPageProps): Promise<Metadata> {
  const { tag } = await params
  const tagName = parseTagFromSlug(tag)
  const jobs = await getTagJobs(tag)
  
  if (!jobs || jobs.length === 0) {
    return {
      title: `No ${tagName} Jobs | Job Board`,
      description: `No job opportunities found for ${tagName}. Check back later for new positions.`
    }
  }
  
  return {
    title: `${jobs.length} ${tagName} Jobs | Job Board`,
    description: `Discover ${jobs.length} ${tagName} job opportunities. Find your perfect career match in ${tagName}.`,
    openGraph: {
      title: `${tagName} Jobs`,
      description: `${jobs.length} job opportunities available for ${tagName}`,
    },
  }
}

async function TagJobsList({ tag }: { tag: string }) {
  const jobs = await getTagJobs(tag)
  const tagName = parseTagFromSlug(tag)
  
  if (!jobs) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">Failed to load jobs. Please try again later.</p>
      </div>
    )
  }
  
  if (jobs.length === 0) {
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
  
  const featuredJobs = jobs.filter(job => job.featured)
  const regularJobs = jobs.filter(job => !job.featured)
  
  return (
    <>
      {featuredJobs.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured {tagName} Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      )}
      
      <div>
        <h2 className="text-2xl font-bold mb-6">
          {featuredJobs.length > 0 ? `All ${tagName} Jobs` : `${tagName} Jobs`}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {regularJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-600">
        <p>
          Found {jobs.length} job{jobs.length !== 1 ? 's' : ''} tagged with "{tagName}"
        </p>
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

export default async function TagJobsPage({ params }: TagJobsPageProps) {
  const { tag } = await params
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
      
      <SearchSection />
      
      <Suspense fallback={<LoadingSkeleton />}>
        <TagJobsList tag={tag} />
      </Suspense>
    </div>
  )
}