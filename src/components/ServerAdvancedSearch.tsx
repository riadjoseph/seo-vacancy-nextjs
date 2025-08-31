import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface ServerAdvancedSearchProps {
  initialValues?: {
    q?: string
    category?: string
    city?: string
  }
}

export function ServerAdvancedSearch({ initialValues }: ServerAdvancedSearchProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <h2 className="text-xl font-semibold">Find Your Perfect Job</h2>
      </CardHeader>
      <CardContent>
        <form method="GET" action="/" className="space-y-4">
          <div>
            <Input
              name="q"
              type="search"
              placeholder="Search for jobs, companies, or skills..."
              defaultValue={initialValues?.q}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                id="category"
                defaultValue={initialValues?.category || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                <option value="SEO">SEO</option>
                <option value="Marketing">Marketing</option>
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Analytics">Analytics</option>
              </select>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <select
                name="city"
                id="city"
                defaultValue={initialValues?.city || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Cities</option>
                <option value="London">London</option>
                <option value="Paris">Paris</option>
                <option value="Berlin">Berlin</option>
                <option value="Amsterdam">Amsterdam</option>
                <option value="Barcelona">Barcelona</option>
                <option value="Madrid">Madrid</option>
                <option value="Milan">Milan</option>
                <option value="Rome">Rome</option>
                <option value="Prague">Prague</option>
                <option value="Vienna">Vienna</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button type="submit" className="w-full gap-2">
                <Search className="h-4 w-4" />
                Search Jobs
              </Button>
            </div>
          </div>

          {(initialValues?.q || initialValues?.category || initialValues?.city) && (
            <div className="flex justify-center">
              <a
                href="/"
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear all filters
              </a>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}