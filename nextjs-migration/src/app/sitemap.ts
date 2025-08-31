import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

function createJobSlug(title: string, company: string, city: string | null): string {
  const slug = `${title}-${company}-${city || 'remote'}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return slug
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const baseUrl = process.env.NEXTAUTH_URL || 'https://seo-vacancy.eu'

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/auth/signin`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ]

  try {
    // Get all jobs for individual job pages
    const { data: jobs } = await supabase
      .from('jobs')
      .select('title, company_name, city, created_at, expires_at')
      .gt('expires_at', new Date().toISOString()) // Only non-expired jobs
      .order('created_at', { ascending: false })

    const jobPages = jobs?.map(job => ({
      url: `${baseUrl}/job/${createJobSlug(job.title, job.company_name, job.city)}`,
      lastModified: new Date(job.created_at || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })) || []

    // Get unique cities for city pages
    const { data: cityJobs } = await supabase
      .from('jobs')
      .select('city')
      .not('city', 'is', null)
      .gt('expires_at', new Date().toISOString())

    const uniqueCities = [...new Set(cityJobs?.map(job => job.city).filter(Boolean))] as string[]
    const cityPages = uniqueCities.map(city => ({
      url: `${baseUrl}/jobs/city/${encodeURIComponent(city.toLowerCase())}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    }))

    // Get unique tags for tag pages
    const { data: tagJobs } = await supabase
      .from('jobs')
      .select('tags')
      .not('tags', 'is', null)
      .gt('expires_at', new Date().toISOString())

    const allTags = tagJobs?.flatMap(job => job.tags || []) || []
    const uniqueTags = [...new Set(allTags)]
    const tagPages = uniqueTags.map(tag => ({
      url: `${baseUrl}/jobs/tag/${encodeURIComponent(tag.toLowerCase().replace(/\s+/g, '-'))}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.5,
    }))

    return [...staticPages, ...jobPages, ...cityPages, ...tagPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}
