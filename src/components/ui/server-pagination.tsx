import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PaginationData } from '@/utils/pagination'
import { cn } from '@/lib/utils'

interface ServerPaginationProps {
  data: PaginationData
  className?: string
  basePath?: string
  searchParams?: URLSearchParams | Record<string, string>
}

function generatePageUrl(
  basePath: string = '/', 
  page: number, 
  searchParams?: URLSearchParams | Record<string, string>
): string {
  const url = new URL(basePath, 'http://localhost')
  
  // Convert searchParams to URLSearchParams if it's a plain object
  let params: URLSearchParams
  if (searchParams instanceof URLSearchParams) {
    params = searchParams
  } else if (searchParams) {
    params = new URLSearchParams()
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
  } else {
    params = new URLSearchParams()
  }
  
  // Copy existing params except 'page'
  params.forEach((value, key) => {
    if (key !== 'page') {
      url.searchParams.set(key, value)
    }
  })
  
  // Set page (remove if page 1)
  if (page === 1) {
    url.searchParams.delete('page')
  } else {
    url.searchParams.set('page', page.toString())
  }
  
  return url.pathname + url.search
}

export function ServerPagination({ data, className, basePath = '/', searchParams }: ServerPaginationProps) {
  if (data.totalPages <= 1) {
    return null
  }

  return (
    <nav
      className={cn('flex items-center justify-center space-x-1', className)}
      aria-label="Pagination Navigation"
    >
      {/* Previous Button */}
      {data.hasPrevPage ? (
        <Link
          href={generatePageUrl(basePath, data.currentPage - 1, searchParams)}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 hover:text-gray-700 transition-colors"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Link>
      ) : (
        <span className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-gray-100 border border-gray-300 rounded-l-md cursor-not-allowed">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </span>
      )}

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {data.ranges.map((range) => {
          if (range.type === 'ellipsis') {
            return (
              <span
                key={range.key}
                className="px-3 py-2 text-sm font-medium text-gray-500"
                aria-hidden="true"
              >
                ...
              </span>
            )
          }

          const isCurrentPage = range.page === data.currentPage
          
          return (
            <Link
              key={range.key}
              href={generatePageUrl(basePath, range.page!, searchParams)}
              className={cn(
                'px-3 py-2 text-sm font-medium border transition-colors',
                isCurrentPage
                  ? 'bg-blue-600 text-white border-blue-600 cursor-default'
                  : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-900'
              )}
              aria-label={
                isCurrentPage
                  ? `Current page, page ${range.page}`
                  : `Go to page ${range.page}`
              }
              aria-current={isCurrentPage ? 'page' : undefined}
            >
              {range.page}
            </Link>
          )
        })}
      </div>

      {/* Next Button */}
      {data.hasNextPage ? (
        <Link
          href={generatePageUrl(basePath, data.currentPage + 1, searchParams)}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 hover:text-gray-700 transition-colors"
          aria-label="Go to next page"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      ) : (
        <span className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-gray-100 border border-gray-300 rounded-r-md cursor-not-allowed">
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </span>
      )}
    </nav>
  )
}

// Results summary component
interface ServerPaginationSummaryProps {
  data: PaginationData
  className?: string
}

export function ServerPaginationSummary({ data, className }: ServerPaginationSummaryProps) {
  const currentPage = isNaN(data.currentPage) ? 1 : data.currentPage
  const itemsPerPage = isNaN(data.itemsPerPage) ? 25 : data.itemsPerPage
  const totalItems = isNaN(data.totalItems) ? 0 : data.totalItems
  
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const endItem = totalItems === 0 ? 0 : Math.min(currentPage * itemsPerPage, totalItems)

  if (totalItems === 0) {
    return (
      <div className={cn('text-sm text-gray-600', className)}>
        No jobs found
      </div>
    )
  }

  return (
    <div className={cn('text-sm text-gray-600', className)}>
      Showing <span className="font-medium">{startItem}</span> to{' '}
      <span className="font-medium">{endItem}</span> of{' '}
      <span className="font-medium">{totalItems}</span> jobs
    </div>
  )
}