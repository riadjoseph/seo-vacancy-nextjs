import { useEffect } from 'react';
import { initGA, usePageTracking } from '@/utils/analytics';
import posthog from 'posthog-js'

const MEASUREMENT_ID = 'G-4S7FY23V18'; // Replace with your GA4 measurement ID

const Analytics = () => {
  usePageTracking();

  useEffect(() => {
    initGA(MEASUREMENT_ID);
  }, []);

  return null;
};

posthog.init('phc_soH2FL1IO9Vzof8zMGv1FHyz4eIFdyuiKcMxUC9oerO',
    {
        api_host: 'https://eu.i.posthog.com',
        person_profiles: 'identified_only' // or 'always' to create profiles for anonymous users as well
    }
)

export default Analytics; 