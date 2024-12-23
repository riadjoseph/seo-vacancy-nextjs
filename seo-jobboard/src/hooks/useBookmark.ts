import { useState, useEffect } from 'react';

const BOOKMARK_KEY = 'job_bookmarks';

export const useBookmark = () => {
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const stored = localStorage.getItem(BOOKMARK_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const isBookmarked = (jobId: string) => bookmarks.includes(jobId);

  const toggleBookmark = (jobId: string) => {
    const newBookmarks = bookmarks.includes(jobId)
      ? bookmarks.filter(id => id !== jobId)
      : [...bookmarks, jobId];
    
    setBookmarks(newBookmarks);
    
    // Append #bookmark to URL and refresh the page
    window.location.hash = 'bookmark';
    window.location.reload();
  };

  const getBookmarks = () => bookmarks;

  return {
    isBookmarked,
    toggleBookmark,
    getBookmarks,
  };
};