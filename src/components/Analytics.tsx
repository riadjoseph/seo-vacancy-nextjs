import { useEffect } from 'react';
import { initGA, usePageTracking } from '@/utils/analytics';

const MEASUREMENT_ID = 'G-4S7FY23V18'; // Replace with your GA4 measurement ID

const Analytics = () => {
  usePageTracking();

  useEffect(() => {
    initGA(MEASUREMENT_ID);
  }, []);

  return null;
};

export default Analytics; 