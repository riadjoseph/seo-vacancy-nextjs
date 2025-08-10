import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
    .limit(10)

  if (error) {
    console.error('Error fetching jobs:', error)
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-4">
          Find Your Next SEO & Tech Career
        </h1>
        <p className="text-xl text-gray-600 text-center max-w-2xl mx-auto">
          Discover the latest SEO, marketing, and tech job opportunities across Europe
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs?.map((job) => (
          <div
            key={job.id}
            className="border rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
                <p className="text-gray-600">{job.company_name}</p>
              </div>
              {job.featured && (
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Featured
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
              {job.city && <span>📍 {job.city}</span>}
              <span>📂 {job.category}</span>
            </div>

            <p className="text-gray-700 mb-4 line-clamp-3">
              {job.description?.substring(0, 150)}...
            </p>

            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-1">
                {job.tags?.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <a
                href={job.job_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
              >
                Apply
              </a>
            </div>
          </div>
        ))}
      </div>

      {!jobs?.length && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No jobs found.</p>
        </div>
      )}
    </main>
  )
}