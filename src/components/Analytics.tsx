import { useEffect } from 'react';
import { initGA, usePageTracking } from '@/utils/analytics';

const MEASUREMENT_ID = 'G-4S7FY23V18'; // Replace with your GA4 measurement ID

const Analytics = () => {
  usePageTracking();

  useEffect(() => {
    // Initialize PostHog for cookieless tracking
    import('posthog-js').then(posthog => {
      posthog.default.init('phc_soH2FL1IO9Vzof8zMGv1FHyz4eIFdyuiKcMxUC9oerO', {
        api_host: 'https://eu.i.posthog.com',
        person_profiles: 'identified_only',
        disable_cookie: true, // Disable cookies
        disable_session_recording: false,
        disable_persistence: true, // Disable local storage persistence
      });
    });
    
    // Initialize GA4 for cookieless tracking
    initGA(MEASUREMENT_ID);
  }, []);

  return null;
};

export default Analytics;