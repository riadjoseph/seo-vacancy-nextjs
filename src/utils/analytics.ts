import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Initialize GA4
export const initGA = (measurementId: string) => {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=G-4S7FY23V18`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    cookie_flags: 'max-age=7200;secure;samesite=none',
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
};

// Custom event tracking
export const trackEvent = (
  eventName: string,
  eventParams?: { [key: string]: any }
) => {
  window.gtag?.('event', eventName, eventParams);
};

// Hook for page view tracking
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    window.gtag?.('event', 'page_view', {
      page_path: location.pathname + location.search,
    });
  }, [location]);
}; 