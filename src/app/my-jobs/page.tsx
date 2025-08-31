import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MyJobsContent } from '@/components/MyJobsContent'

export const metadata: Metadata = {
  title: 'My Jobs - SEO Vacancy',
  description: 'Manage your job postings and applications',
}

export default async function MyJobsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/magic-link?redirect=/my-jobs')
  }

  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Jobs</h1>
        <p className="text-gray-600">
          Manage your job postings and track applications
        </p>
      </div>
      
      <MyJobsContent jobs={jobs || []} />
    </div>
  )
}