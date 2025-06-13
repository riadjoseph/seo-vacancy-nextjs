// Improved NotFoundBoundary.tsx with bot-specific handling
import { useEffect, useState } from "react";
import { useRouteError } from "react-router-dom";
import { Helmet } from "react-helmet";

const NotFoundBoundary = () => {
  const error = useRouteError();
  
  useEffect(() => {
    // Set the status code at the document level
    document.documentElement.dataset.status = "404";
    
    // Create and dispatch a custom event to set the HTTP status code
    const statusEvent = new CustomEvent('httpStatus', { 
      detail: 404,
      bubbles: true,
      cancelable: true 
    });
    window.dispatchEvent(statusEvent);

    // Enhanced meta tag for Netlify
    const meta = document.createElement('meta');
    meta.name = 'netlify:status';
    meta.content = '404';
    document.head.appendChild(meta);

    // Log for debugging
    console.log('404 NotFoundBoundary mounted', {
      path: window.location.pathname,
      userAgent: navigator.userAgent
    });
  }, []);
  
  return (
    <>
      <Helmet>
        <title>Page Not Found</title>
        <link rel="canonical" href="https://seo-vacancy.eu/error" />
        <meta name="robots" content="noindex" />
        <meta httpEquiv="Status" content="404" />
        <meta name="netlify:status" content="404" />
      </Helmet>
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or may have been moved.
        </p>
            <div className="space-y-4">
              <a href="/" className="text-blue-500 hover:underline block">
                Browse all jobs
              </a>
              <a href="https://seo-vacancy.eu/jobs/tag/technical-seo" className="text-blue-500 hover:underline block">
                View Technical SEO job categories
              </a>
              <a href="https://seo-vacancy.eu/jobs/tag/content-seo" className="text-blue-500 hover:underline block">
                View Content SEO job categories
              </a>
              <a href="https://seo-vacancy.eu/jobs/tag/e-commerce-seo" className="text-blue-500 hover:underline block">
                View E-Commerce SEO job categories
              </a>
              <a href="https://seo-vacancy.eu/jobs/tag/enterprise-seo" className="text-blue-500 hover:underline block">
                View Enterprise SEO job categories
              </a>
            </div>
        
        {/* Debug info for development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded text-left text-sm">
            <strong>Debug Info:</strong><br />
            Path: {window.location.pathname}<br />
            User Agent: {navigator.userAgent}
          </div>
        )}
      </div>
    </>
  );
};

export default NotFoundBoundary;