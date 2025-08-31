import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Link>
      </div>
      
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-8 text-center">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Job Not Found</h1>
          <p className="text-gray-600 mb-6">
            The job you're looking for doesn't exist or may have been removed.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/">
              <Button>Browse All Jobs</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Search Jobs</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}