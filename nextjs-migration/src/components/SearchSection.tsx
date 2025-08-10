'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Filter } from 'lucide-react'

interface SearchSectionProps {
  onSearch?: (query: string) => void
}

export function SearchSection({ onSearch }: SearchSectionProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams?.get('q') || '')
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (onSearch) {
      onSearch(query)
    } else {
      // Navigate with search params
      const params = new URLSearchParams(searchParams?.toString())
      if (query.trim()) {
        params.set('q', query.trim())
      } else {
        params.delete('q')
      }
      router.push(`/?${params.toString()}`)
    }
  }
  
  const handleClear = () => {
    setQuery('')
    if (onSearch) {
      onSearch('')
    } else {
      const params = new URLSearchParams(searchParams?.toString())
      params.delete('q')
      router.push(`/?${params.toString()}`)
    }
  }
  
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search jobs by title, company, or skills..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" className="gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
          {query && (
            <Button type="button" variant="outline" onClick={handleClear}>
              Clear
            </Button>
          )}
        </form>
        
        <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-600">
          <span>Popular searches:</span>
          <button 
            type="button"
            onClick={() => setQuery('SEO')}
            className="text-blue-600 hover:underline"
          >
            SEO
          </button>
          <button 
            type="button"
            onClick={() => setQuery('Marketing')}
            className="text-blue-600 hover:underline"
          >
            Marketing
          </button>
          <button 
            type="button"
            onClick={() => setQuery('Remote')}
            className="text-blue-600 hover:underline"
          >
            Remote
          </button>
          <button 
            type="button"
            onClick={() => setQuery('JavaScript')}
            className="text-blue-600 hover:underline"
          >
            JavaScript
          </button>
        </div>
      </CardContent>
    </Card>
  )
}