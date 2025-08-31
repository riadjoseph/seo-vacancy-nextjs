'use client'

import { useEffect, useState, useTransition, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface MobileAdvancedSearchProps {
  initialValues?: {
    tags?: string | string[]
    city?: string
    tag?: string // For when we're on a tag page
  }
}

const SEO_SPECIALIZATIONS = [
  "Technical SEO",
  "Content SEO", 
  "Local SEO",
  "E-commerce SEO",
  "International SEO",
  "Enterprise SEO",
  "Link Building",
  "SEO Strategy & Management",
  "Analytics & Data SEO"
] as const

export function MobileAdvancedSearch({ initialValues }: MobileAdvancedSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [cities, setCities] = useState<string[]>([])
  const [loadingCities, setLoadingCities] = useState(true)
  const [citySearch, setCitySearch] = useState('')
  const [showCityDropdown, setShowCityDropdown] = useState(false)

  // Load available cities from database
  useEffect(() => {
    async function fetchCities() {
      try {
        const supabase = createClient()
        const { data: cityJobs } = await supabase
          .from('jobs')
          .select('city')
          .not('city', 'is', null)
          .or(`expires_at.is.null,expires_at.gte.${new Date().toISOString()}`)

        const uniqueCities = [...new Set(
          cityJobs?.map(job => job.city).filter(Boolean)
        )].sort() as string[]
        
        setCities(uniqueCities)
      } catch (error) {
        console.error('Error fetching cities:', error)
      } finally {
        setLoadingCities(false)
      }
    }

    fetchCities()
  }, [])

  // Get current selections from URL or initial values
  const getCurrentTag = () => {
    // Try to get from search params first, then from initial values
    const tagsParam = searchParams.get('tags')
    if (tagsParam) return tagsParam
    
    // If we're on a tag page, convert slug back to display name
    if (initialValues?.tag) {
      const tagSlug = initialValues.tag
      return SEO_SPECIALIZATIONS.find(spec => 
        spec.toLowerCase().replace(/\s+/g, '-') === tagSlug.toLowerCase()
      ) || ''
    }
    
    return ''
  }

  const getCurrentCity = () => {
    const cityParam = searchParams.get('city')
    if (cityParam) return cityParam
    return initialValues?.city || ''
  }

  const currentTag = getCurrentTag()
  const currentCity = getCurrentCity()
  const hasActiveFilters = currentTag || currentCity

  // Filter cities based on search input
  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) return cities
    return cities.filter(city => 
      city.toLowerCase().includes(citySearch.toLowerCase())
    )
  }, [cities, citySearch])

  // Set initial city search value
  useEffect(() => {
    const city = getCurrentCity()
    if (city) {
      setCitySearch(city)
    }
  }, [searchParams, initialValues])

  const handleFilterChange = (key: string, value: string) => {
    startTransition(() => {
      if (key === 'city' && value) {
        // Navigate to city page
        router.push(`/jobs/city/${encodeURIComponent(value.toLowerCase())}`)
      } else if (key === 'tags' && value) {
        // Navigate to tag page - convert spaces to hyphens and lowercase
        const tagSlug = value.toLowerCase().replace(/\s+/g, '-')
        router.push(`/jobs/tag/${encodeURIComponent(tagSlug)}`)
      } else {
        // Clear filters or navigate back to homepage
        router.push('/')
      }
    })
  }

  const clearFilters = () => {
    startTransition(() => {
      setCitySearch('')
      router.push('/')
    })
  }

  const handleCitySelect = (city: string) => {
    setCitySearch(city)
    setShowCityDropdown(false)
    handleFilterChange('city', city)
  }

  const handleCitySearchChange = (value: string) => {
    setCitySearch(value)
    setShowCityDropdown(true)
    
    // If user clears the search, also clear the filter
    if (!value.trim()) {
      handleFilterChange('city', '')
    }
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Mobile-first: Stack vertically */}
          <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
            {/* SEO Specialization Filter */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                SEO Specialization
              </label>
              <select
                name="tags"
                id="tags"
                value={currentTag}
                onChange={(e) => handleFilterChange('tags', e.target.value)}
                disabled={isPending}
                className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm bg-white disabled:opacity-50"
              >
                <option value="">All Specializations</option>
                {SEO_SPECIALIZATIONS.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div className="relative">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <Input
                name="city"
                id="city"
                type="text"
                placeholder="Search cities..."
                value={citySearch}
                onChange={(e) => handleCitySearchChange(e.target.value)}
                onFocus={() => setShowCityDropdown(true)}
                onBlur={() => {
                  // Delay hiding to allow click on dropdown items
                  setTimeout(() => setShowCityDropdown(false), 150)
                }}
                disabled={isPending || loadingCities}
                className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm bg-white disabled:opacity-50"
              />
              
              {/* Dropdown */}
              {showCityDropdown && !loadingCities && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredCities.length === 0 ? (
                    <div className="px-3 py-2 text-gray-500 text-sm">
                      {citySearch.trim() ? 'No cities found' : 'Start typing to search cities'}
                    </div>
                  ) : (
                    filteredCities.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => handleCitySelect(city)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
                      >
                        {city}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Clear filters - only show if there are active filters */}
          {hasActiveFilters && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={clearFilters}
                disabled={isPending}
                className="text-sm text-gray-500 hover:text-gray-700 underline disabled:opacity-50 disabled:no-underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Loading indicator */}
          {isPending && (
            <div className="flex items-center justify-center py-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-sm text-gray-500">Updating results...</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}