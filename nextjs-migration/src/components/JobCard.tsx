import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, MapPin, Briefcase, Calendar } from 'lucide-react'
import type { Tables } from '@/lib/supabase/types'

type Job = Tables<'jobs'>

interface JobCardProps {
  job: Job
}

function createJobSlug(title: string, company: string, city: string | null): string {
  const slug = `${title}-${company}-${city || 'remote'}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return slug
}

export function JobCard({ job }: JobCardProps) {
  const slug = createJobSlug(job.title, job.company_name, job.city)
  
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <Link 
              href={`/job/${slug}`}
              className="block"
            >
              <h3 className="text-xl font-semibold hover:text-blue-600 transition-colors line-clamp-2">
                {job.title}
              </h3>
            </Link>
            <p className="text-gray-600 font-medium mt-1">{job.company_name}</p>
          </div>
          {job.featured && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
              Featured
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
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
              <span>{new Date(job.created_at).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <p className="text-gray-700 line-clamp-3 text-sm">
          {job.description?.replace(/<[^>]*>/g, '').substring(0, 150)}...
        </p>

        {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {job.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {job.tags.length > 3 && (
              <Badge variant="outline" className="text-xs text-gray-500">
                +{job.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <div className="flex justify-between items-center pt-2">
          <Link href={`/job/${slug}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
          <a
            href={job.job_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex"
          >
            <Button size="sm" className="gap-1">
              Apply
              <ExternalLink className="h-3 w-3" />
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  )
}