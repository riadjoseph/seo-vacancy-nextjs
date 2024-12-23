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

  const getFirstBlockStart = (page: number, blockSize: number = 10) => {
    return Math.floor((page - 1) / blockSize) * blockSize + 1;
  };

  const getGhostBlockStart = (page: number) => {
    return page * 10 + 1;
  };

  const firstBlockStart = getFirstBlockStart(currentPage);
  const ghostBlockStart = getGhostBlockStart(currentPage);

  const renderPageNumbers = (start: number, count: number) => {
    return Array.from({ length: count }, (_, i) => {
      const pageNum = start + i;
      if (pageNum > totalPages) return null;
      
      return (
        <Link
          key={pageNum}
          to={createPageUrl(pageNum)}
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            currentPage === pageNum
              ? "bg-primary text-primary-foreground"
              : "text-gray-600 hover:bg-gray-100"
          }`}
          aria-current={currentPage === pageNum ? "page" : undefined}
        >
          {pageNum}
        </Link>
      );
    });
  };

  return (
    <nav aria-label="Pagination" className="mt-8">
      <div className="flex justify-center items-center gap-2">
        {currentPage > 1 && (
          <Link
            to={createPageUrl(currentPage - 1)}
            className="p-2 rounded-md hover:bg-gray-100"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
        )}

        <div className="flex items-center gap-1">
          {renderPageNumbers(firstBlockStart, 10)}
        </div>

        {totalPages > 10 && (
          <>
            <span className="px-2 text-gray-400">...</span>
            <div className="flex items-center gap-1">
              {renderPageNumbers(ghostBlockStart, 10)}
            </div>
          </>
        )}

        {currentPage < totalPages && (
          <Link
            to={createPageUrl(currentPage + 1)}
            className="p-2 rounded-md hover:bg-gray-100"
            aria-label="Next page"
          >
            <ChevronRight className="h-5 w-5" />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Pagination;