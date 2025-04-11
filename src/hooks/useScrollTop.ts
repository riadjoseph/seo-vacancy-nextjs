import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A hook that scrolls to top when the location changes
 */
export function useScrollTop() {
  const { pathname, search } = useLocation();
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname, search]);
}

export default useScrollTop; 