import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { JobCard } from '@/components/JobCard'
import { JobCardSkeleton } from '@/components/JobCardSkeleton'
import { SearchSection } from '@/components/SearchSection'
import { ArrowLeft, MapPin } from 'lucide-react'

interface CityJobsPageProps {
  params: Promise<{
    city: string
  }>
}

async function getCityJobs(city: string) {
  const supabase = await createClient()
  const decodedCity = decodeURIComponent(city).toLowerCase()
  
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
    .ilike('city', decodedCity)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching city jobs:', error)
    return null
  }
  
  return jobs
}

export async function generateMetadata({ params }: CityJobsPageProps): Promise<Metadata> {
  const { city } = await params
  const decodedCity = decodeURIComponent(city)
  const jobs = await getCityJobs(city)
  
  if (!jobs || jobs.length === 0) {
    return {
      title: `No Jobs in ${decodedCity} | Job Board`,
      description: `No job opportunities found in ${decodedCity}. Check back later for new positions.`
    }
  }
  
  return {
    title: `${jobs.length} Jobs in ${decodedCity} | Job Board`,
    description: `Discover ${jobs.length} SEO and tech job opportunities in ${decodedCity}. Find your perfect career match today.`,
    openGraph: {
      title: `Jobs in ${decodedCity}`,
      description: `${jobs.length} job opportunities available in ${decodedCity}`,
    },
  }
}

async function CityJobsList({ city }: { city: string }) {
  const jobs = await getCityJobs(city)
  const decodedCity = decodeURIComponent(city)
  
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
        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          No jobs found in {decodedCity}
        </h2>
        <p className="text-gray-600 mb-6">
          We don&apos;t have any job listings for {decodedCity} right now.
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
          <h2 className="text-2xl font-bold mb-6">Featured Jobs in {decodedCity}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      )}
      
      <div>
        <h2 className="text-2xl font-bold mb-6">
          {featuredJobs.length > 0 ? `All Jobs in ${decodedCity}` : `Jobs in ${decodedCity}`}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {regularJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-600">
        <p>
          Found {jobs.length} job{jobs.length !== 1 ? 's' : ''} in {decodedCity}
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

export default async function CityJobsPage({ params }: CityJobsPageProps) {
  const { city } = await params
  const decodedCity = decodeURIComponent(city)
  
  return (
    <main className="container mx-auto py-8 px-4">
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
      
      <SearchSection />
      
      <Suspense fallback={<LoadingSkeleton />}>
        <CityJobsList city={city} />
      </Suspense>
    </main>
  )
}