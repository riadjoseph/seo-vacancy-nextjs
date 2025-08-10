import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Briefcase, 
  Calendar, 
  ExternalLink, 
  ArrowLeft,
  Building2,
  Clock
} from 'lucide-react'
import type { Tables } from '@/lib/supabase/types'

type Job = Tables<'jobs'>

interface JobPageProps {
  params: Promise<{
    slug: string
  }>
}

function createJobSlug(title: string, company: string, city: string | null): string {
  const slug = `${title}-${company}-${city || 'remote'}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return slug
}

async function getJobBySlug(slug: string): Promise<Job | null> {
  const supabase = await createClient()
  
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
  
  if (error || !jobs) {
    return null
  }
  
  // Find job by matching slug
  const job = jobs.find(job => {
    const jobSlug = createJobSlug(job.title, job.company_name, job.city)
    return jobSlug === slug
  })
  
  return job || null
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { slug } = await params
  const job = await getJobBySlug(slug)
  
  if (!job) {
    return {
      title: 'Job Not Found',
      description: 'The job you are looking for could not be found.'
    }
  }
  
  return {
    title: `${job.title} at ${job.company_name} | Job Board`,
    description: `${job.description?.replace(/<[^>]*>/g, '').substring(0, 155)}...`,
    openGraph: {
      title: `${job.title} at ${job.company_name}`,
      description: `${job.description?.replace(/<[^>]*>/g, '').substring(0, 155)}...`,
      type: 'article',
      publishedTime: job.created_at || undefined,
    },
  }
}

export default async function JobPage({ params }: JobPageProps) {
  const { slug } = await params
  const job = await getJobBySlug(slug)
  
  if (!job) {
    notFound()
  }
  
  // Check if job is expired
  const isExpired = new Date(job.expires_at) < new Date()
  
  if (isExpired) {
    return (
      <main className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>
        </div>
        
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-8 text-center">
            <Clock className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-800 mb-2">Job Expired</h1>
            <p className="text-red-600">This job posting has expired and is no longer accepting applications.</p>
            <div className="mt-4">
              <Link href="/">
                <Button variant="outline">Browse Current Jobs</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }
  
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                  <div className="flex items-center gap-2 text-xl text-gray-600">
                    <Building2 className="h-5 w-5" />
                    <span>{job.company_name}</span>
                  </div>
                </div>
                {job.featured && (
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                    Featured
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 pt-4">
                {job.city && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{job.city}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  <span>{job.category}</span>
                </div>
                {job.created_at && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Job Description</h2>
            </CardHeader>
            <CardContent>
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: job.description || 'No description available.' 
                }}
              />
            </CardContent>
          </Card>
          
          {job.tags && job.tags.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Skills & Requirements</h2>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <h3 className="text-lg font-semibold">Apply for this position</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <a
                href={job.job_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button size="lg" className="w-full gap-2">
                  Apply Now
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
              
              {job.expires_at && (
                <p className="text-sm text-gray-500 text-center">
                  Application deadline: {new Date(job.expires_at).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Job Details</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {job.city && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{job.city}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium">{job.category}</span>
              </div>
              {job.created_at && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Posted:</span>
                  <span className="font-medium">{new Date(job.created_at).toLocaleDateString()}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "JobPosting",
            title: job.title,
            description: job.description?.replace(/<[^>]*>/g, '') || '',
            identifier: {
              "@type": "PropertyValue",
              name: "Job ID",
              value: job.id,
            },
            datePosted: job.created_at,
            validThrough: job.expires_at,
            employmentType: "FULL_TIME",
            hiringOrganization: {
              "@type": "Organization",
              name: job.company_name,
            },
            jobLocation: job.city ? {
              "@type": "Place",
              address: {
                "@type": "PostalAddress",
                addressLocality: job.city,
              },
            } : undefined,
            industry: job.category,
          }),
        }}
      />
    </main>
  )
}