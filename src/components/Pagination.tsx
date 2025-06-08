import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  createPageUrl: (page: number) => string;
}

const Pagination = ({ currentPage, totalPages, createPageUrl }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Calculate range around current page
    const rangeStart = Math.max(2, currentPage - 1);
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      pages.push('ellipsis1');
    }
    
    // Add pages around current page
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      pages.push('ellipsis2');
    }
    
    // Always show last page if > 1
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <nav aria-label="Pagination" className="flex justify-center my-8 px-4 max-w-full overflow-x-auto">
      <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
        {currentPage > 1 && (
          <Link
            to={createPageUrl(currentPage - 1)}
            onClick={() => window.scrollTo(0, 0)}
            className="p-1 sm:p-2 rounded-md hover:bg-gray-100 flex items-center justify-center"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        )}

        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          {getPageNumbers().map((page, i) => {
            if (page === 'ellipsis1' || page === 'ellipsis2') {
              return (
                <span key={`ellipsis-${i}`} className="px-1 sm:px-2 text-gray-400">
                  ...
                </span>
              );
            }
            
            const pageNum = page as number;
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => {
                  window.scrollTo(0, 0);
                  // Use your navigation logic here, e.g.:
                  window.history.pushState({}, '', createPageUrl(pageNum));
                  // Optionally, trigger a router navigation if using react-router
                  // navigate(createPageUrl(pageNum));
                }}
                className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium ${
                  currentPage === pageNum
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                aria-current={currentPage === pageNum ? "page" : undefined}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {currentPage < totalPages && (
          <Link
            to={createPageUrl(currentPage + 1)}
            onClick={() => window.scrollTo(0, 0)}
            className="p-1 sm:p-2 rounded-md hover:bg-gray-100 flex items-center justify-center"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Pagination;