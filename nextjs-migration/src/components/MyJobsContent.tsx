'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Eye, Edit, Trash2, MapPin, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { createTagSlug } from '@/utils/tagUtils'

interface Job {
  id: string
  title: string
  company_name: string
  company_logo: string | null
  city: string | null
  category: string
  created_at: string
  expires_at: string
  featured: boolean
  tags: string[]
}

interface MyJobsContentProps {
  jobs: Job[]
}

export function MyJobsContent({ jobs: initialJobs }: MyJobsContentProps) {
  const [jobs, setJobs] = useState(initialJobs)
  const [loading, setLoading] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return
    
    setLoading(jobId)
    
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId)

      if (error) {
        alert('Failed to delete job: ' + error.message)
      } else {
        setJobs(jobs.filter(job => job.id !== jobId))
      }
    } catch (error) {
      alert('An error occurred while deleting the job')
    } finally {
      setLoading('')
    }
  }

  const createJobSlug = (title: string, company: string, city: string | null): string => {
    const slug = `${title}-${company}-${city || 'remote'}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    return slug
  }

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date()

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No job postings yet</h3>
          <p className="text-gray-600">Get started by posting your first job opportunity</p>
        </div>
        <Link href="/post-job">
          <Button className="inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Post Your First Job
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600">{jobs.length} job posting{jobs.length !== 1 ? 's' : ''}</p>
        <Link href="/post-job">
          <Button className="inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Post New Job
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className={`${isExpired(job.expires_at) ? 'opacity-60' : ''}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex gap-3 flex-1">
                  {job.company_logo && job.company_logo.trim() && job.company_logo !== "'" && (
                    <img 
                      src={job.company_logo} 
                      alt={job.company_name}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      {job.featured && <Badge variant="secondary">Featured</Badge>}
                      {isExpired(job.expires_at) && <Badge variant="destructive">Expired</Badge>}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 gap-4">
                      <span className="font-medium">{job.company_name}</span>
                    {job.city && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.city}
                      </span>
                    )}
                    <span className="flex items-center gap-1" suppressHydrationWarning>
                      <Calendar className="w-3 h-3" />
                      Posted {new Date(job.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {job.category && job.category !== 'FULL_TIME' && (
                      <Badge variant="outline">{job.category}</Badge>
                    )}
                    {job.tags.slice(0, 3).map((tag) => (
                      <Link key={tag} href={`/jobs/tag/${createTagSlug(tag)}`}>
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800 cursor-pointer transition-colors">
                          {tag}
                        </Badge>
                      </Link>
                    ))}
                    {job.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{job.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Link href={`/job/${createJobSlug(job.title, job.company_name, job.city)}`}>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      View
                    </Button>
                  </Link>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => router.push(`/edit-job/${job.id}`)}
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteJob(job.id)}
                    disabled={loading === job.id}
                  >
                    <Trash2 className="w-3 h-3" />
                    {loading === job.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}