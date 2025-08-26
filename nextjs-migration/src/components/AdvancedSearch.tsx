'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Search, Filter, X } from 'lucide-react'

const JOB_CATEGORIES = [
  'SEO',
  'Marketing', 
  'JavaScript',
  'Python',
  'React',
  'Node.js',
  'Data Science',
  'DevOps',
  'UI/UX Design',
  'Product Management'
]

const CITIES = [
  'London',
  'Berlin', 
  'Amsterdam',
  'Paris',
  'Barcelona',
  'Milan',
  'Stockholm',
  'Copenhagen',
  'Dublin',
  'Remote'
]

interface AdvancedSearchProps {
  onSearch?: (filters: SearchFilters) => void
  showAsModal?: boolean
}

export interface SearchFilters {
  query: string
  category: string
  city: string
  tags: string[]
}

export function AdvancedSearch({ onSearch, showAsModal = false }: AdvancedSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams?.get('q') || '',
    category: searchParams?.get('category') || '',
    city: searchParams?.get('city') || '',
    tags: searchParams?.getAll('tags') || [],
  })
  
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleSearch = () => {
    if (onSearch) {
      onSearch(filters)
    } else {
      const params = new URLSearchParams()
      
      if (filters.query.trim()) params.set('q', filters.query.trim())
      if (filters.category) params.set('category', filters.category)
      if (filters.city) params.set('city', filters.city)
      filters.tags.forEach(tag => params.append('tags', tag))
      
      router.push(`/?${params.toString()}`)
    }
  }

  const handleClear = () => {
    const clearedFilters = { query: '', category: '', city: '', tags: [] }
    setFilters(clearedFilters)
    
    if (onSearch) {
      onSearch(clearedFilters)
    } else {
      router.push('/')
    }
  }

  const addTag = (tag: string) => {
    if (!filters.tags.includes(tag)) {
      setFilters(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
    }
  }

  const removeTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const hasFilters = filters.query || filters.category || filters.city || filters.tags.length > 0

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        {/* Basic Search */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search jobs by title, company, or skills..."
              value={filters.query}
              onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setShowAdvanced(!showAdvanced)} variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button onClick={handleSearch} className="gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Select value={filters.category || "all"} onValueChange={(value) => 
                  setFilters(prev => ({ ...prev, category: value === "all" ? "" : value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {JOB_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <Select value={filters.city || "all"} onValueChange={(value) => 
                  setFilters(prev => ({ ...prev, city: value === "all" ? "" : value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {CITIES.map(city => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Skills Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Skills</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {JOB_CATEGORIES.map(skill => (
                  <Button
                    key={skill}
                    variant="outline"
                    size="sm"
                    onClick={() => addTag(skill)}
                    disabled={filters.tags.includes(skill)}
                    className="h-8"
                  >
                    {skill}
                  </Button>
                ))}
              </div>
              
              {filters.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {filters.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={handleSearch} className="gap-2">
                <Search className="h-4 w-4" />
                Apply Filters
              </Button>
              {hasFilters && (
                <Button variant="outline" onClick={handleClear}>
                  Clear All
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasFilters && !showAdvanced && (
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <span className="text-sm text-gray-600">Active filters:</span>
            {filters.query && (
              <Badge variant="secondary">Query: {filters.query}</Badge>
            )}
            {filters.category && (
              <Badge variant="secondary">Category: {filters.category}</Badge>
            )}
            {filters.city && (
              <Badge variant="secondary">Location: {filters.city}</Badge>
            )}
            {filters.tags.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
            <Button variant="ghost" size="sm" onClick={handleClear} className="h-6 px-2">
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Popular Searches */}
        {!hasFilters && (
          <div className="flex flex-wrap gap-2 text-sm text-gray-600 pt-4 border-t">
            <span>Popular searches:</span>
            <button 
              onClick={() => setFilters(prev => ({ ...prev, query: 'SEO' }))}
              className="text-blue-600 hover:underline"
            >
              SEO
            </button>
            <button 
              onClick={() => setFilters(prev => ({ ...prev, query: 'Remote' }))}
              className="text-blue-600 hover:underline"
            >
              Remote
            </button>
            <button 
              onClick={() => setFilters(prev => ({ ...prev, query: 'JavaScript' }))}
              className="text-blue-600 hover:underline"
            >
              JavaScript
            </button>
            <button 
              onClick={() => setFilters(prev => ({ ...prev, city: 'London' }))}
              className="text-blue-600 hover:underline"
            >
              London
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}