/**
 * Ghostblock Pagination Utilities
 * Reference: https://audisto.com/guides/pagination/#ghostblock
 */

export interface PaginationRange {
  type: 'page' | 'ellipsis'
  page?: number
  key: string
}

export interface PaginationData {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
  ranges: PaginationRange[]
}

/**
 * Generate Ghostblock pagination ranges
 * Examples:
 * - Page 2: [1, 2, 3, ..., 8, 9]
 * - Page 4: [1, 2, 3, 4, 5, ..., 8, 9]
 * - Page 5: [1, 2, ..., 4, 5, 6, ..., 8, 9]
 */
export function generateGhostblockRanges(
  currentPage: number,
  totalPages: number
): PaginationRange[] {
  // Safety checks for invalid inputs
  const safeCurrentPage = isNaN(currentPage) || currentPage < 1 ? 1 : Math.floor(currentPage)
  const safeTotalPages = isNaN(totalPages) || totalPages < 1 ? 1 : Math.floor(totalPages)
  
  if (safeTotalPages <= 7) {
    // Show all pages if 7 or fewer
    return Array.from({ length: safeTotalPages }, (_, i) => ({
      type: 'page' as const,
      page: i + 1,
      key: `page-${i + 1}`
    }))
  }

  const ranges: PaginationRange[] = []
  
  // Always show first page
  ranges.push({ type: 'page', page: 1, key: 'page-1' })
  
  if (safeCurrentPage <= 4) {
    // Show pages 2-5, then ellipsis, then last two pages
    for (let i = 2; i <= Math.min(5, safeTotalPages - 2); i++) {
      ranges.push({ type: 'page', page: i, key: `page-${i}` })
    }
    
    if (safeTotalPages > 6) {
      ranges.push({ type: 'ellipsis', key: 'ellipsis-1' })
    }
    
    // Last two pages
    if (safeTotalPages > 1) {
      if (safeTotalPages > 6) {
        ranges.push({ type: 'page', page: safeTotalPages - 1, key: `page-${safeTotalPages - 1}` })
      }
      ranges.push({ type: 'page', page: safeTotalPages, key: `page-${safeTotalPages}` })
    }
  } else if (safeCurrentPage >= safeTotalPages - 3) {
    // Show first page, ellipsis, then last 5 pages
    ranges.push({ type: 'ellipsis', key: 'ellipsis-1' })
    
    for (let i = Math.max(safeTotalPages - 4, 2); i <= safeTotalPages; i++) {
      ranges.push({ type: 'page', page: i, key: `page-${i}` })
    }
  } else {
    // Show first page, ellipsis, current ± 2, ellipsis, last page
    ranges.push({ type: 'ellipsis', key: 'ellipsis-1' })
    
    for (let i = safeCurrentPage - 1; i <= safeCurrentPage + 1; i++) {
      ranges.push({ type: 'page', page: i, key: `page-${i}` })
    }
    
    ranges.push({ type: 'ellipsis', key: 'ellipsis-2' })
    ranges.push({ type: 'page', page: safeTotalPages, key: `page-${safeTotalPages}` })
  }
  
  return ranges
}

/**
 * Calculate pagination data for a given page and total items
 */
export function calculatePagination(
  currentPage: number,
  totalItems: number,
  itemsPerPage: number = 25
): PaginationData {
  // Ensure we have valid numbers
  const safeCurrentPage = isNaN(currentPage) || currentPage < 1 ? 1 : Math.floor(currentPage)
  const safeTotalItems = isNaN(totalItems) || totalItems < 0 ? 0 : totalItems
  const safeItemsPerPage = isNaN(itemsPerPage) || itemsPerPage < 1 ? 25 : itemsPerPage
  
  const totalPages = safeTotalItems === 0 ? 1 : Math.ceil(safeTotalItems / safeItemsPerPage)
  const validCurrentPage = Math.max(1, Math.min(safeCurrentPage, totalPages))
  
  return {
    currentPage: validCurrentPage,
    totalPages,
    totalItems: safeTotalItems,
    itemsPerPage: safeItemsPerPage,
    hasNextPage: validCurrentPage < totalPages,
    hasPrevPage: validCurrentPage > 1,
    ranges: generateGhostblockRanges(validCurrentPage, totalPages)
  }
}

/**
 * Generate URL with updated page parameter while preserving other query params
 */
export function generatePageUrl(
  currentUrl: string,
  newPage: number,
  searchParams?: URLSearchParams
): string {
  const url = new URL(currentUrl, 'http://localhost:3000')
  
  // Copy existing search params
  if (searchParams) {
    searchParams.forEach((value, key) => {
      if (key !== 'page') {
        url.searchParams.set(key, value)
      }
    })
  }
  
  // Set new page (remove if page 1)
  if (newPage === 1) {
    url.searchParams.delete('page')
  } else {
    url.searchParams.set('page', newPage.toString())
  }
  
  return url.pathname + url.search
}

/**
 * Get pagination cache headers for pages 2-3 (2 days cache)
 */
export function getPaginationCacheHeaders(page: number): Record<string, string> {
  if (page === 2 || page === 3) {
    return {
      'Cache-Control': 'public, max-age=172800, stale-while-revalidate=86400', // 2 days cache, 1 day stale
      'CDN-Cache-Control': 'public, max-age=172800'
    }
  }
  
  return {
    'Cache-Control': 'public, max-age=300, stale-while-revalidate=60' // 5 minutes cache for other pages
  }
}