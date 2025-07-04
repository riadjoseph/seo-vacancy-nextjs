import { useEffect } from 'react';
import { initGA, usePageTracking } from '@/utils/analytics';

const MEASUREMENT_ID = 'G-4S7FY23V18'; // Replace with your GA4 measurement ID

const Analytics = ({ enable }: { enable: boolean }) => {
  usePageTracking();

  useEffect(() => {
    if (enable) {
      // Dynamically import posthog only if consent is given
      import('posthog-js').then(posthog => {
        posthog.default.init('phc_soH2FL1IO9Vzof8zMGv1FHyz4eIFdyuiKcMxUC9oerO', {
          api_host: 'https://eu.i.posthog.com',
          person_profiles: 'identified_only',
        });
      });
      initGA(MEASUREMENT_ID);
    }
  }, [enable]);

  return null;
};

export default Analytics;