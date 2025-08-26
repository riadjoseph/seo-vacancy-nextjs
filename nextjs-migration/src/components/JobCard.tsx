import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, MapPin, Briefcase, Calendar } from 'lucide-react'
import { createTagSlug } from '@/utils/tagUtils'
import type { Tables } from '@/lib/supabase/types'

type Job = Tables<'jobs'>

interface JobCardProps {
  job: Job
  isFeatured?: boolean
}

function createJobSlug(title: string, company: string, city: string | null): string {
  const slug = `${title}-${company}-${city || 'remote'}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return slug
}

export function JobCard({ job, isFeatured = false }: JobCardProps) {
  const slug = createJobSlug(job.title, job.company_name, job.city)
  
  const cardClasses = isFeatured 
    ? "rounded-lg text-card-foreground shadow-sm p-6 hover:shadow-lg transition-all duration-300 border-2 border-blue-200 bg-blue-50/50"
    : "hover:shadow-md transition-shadow duration-200"
  
  return (
    <Card className={cardClasses}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex gap-3 flex-1">
            {job.company_logo && job.company_logo.trim() && job.company_logo !== "'" && (
              <img 
                src={job.company_logo} 
                alt={job.company_name}
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
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
          {job.category && job.category !== 'FULL_TIME' && (
            <div className="flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              <span>{job.category}</span>
            </div>
          )}
          {job.created_at && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span suppressHydrationWarning>{new Date(job.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
            </div>
          )}
        </div>

        <div className="text-gray-700 line-clamp-3 text-sm prose prose-sm max-w-none whitespace-pre-line">
          <ReactMarkdown>
            {job.description?.substring(0, 150) + '...' || ''}
          </ReactMarkdown>
        </div>

        {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {job.tags.slice(0, 3).map((tag, index) => (
              <Link key={index} href={`/jobs/tag/${createTagSlug(tag)}`}>
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800 cursor-pointer transition-colors">
                  {tag}
                </Badge>
              </Link>
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