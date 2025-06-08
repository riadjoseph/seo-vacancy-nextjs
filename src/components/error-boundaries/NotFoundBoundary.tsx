import { useEffect } from "react";
import { useRouteError } from "react-router-dom";
import { Helmet } from "react-helmet";

// Declare the window interface extension for netlifyIdentity
declare global {
  interface Window {
    netlifyIdentity?: {
      on: (event: string, callback: (err: Error) => void) => void;
    };
  }
}

const NotFoundBoundary = () => {
  const error = useRouteError();
  
  useEffect(() => {
    // Set the status code at the document level
    document.documentElement.dataset.status = "404";
    
    // Force header update for Netlify
    const headers = new Headers();
    headers.set('x-status', '404');
    
    // Create and dispatch a custom event to set the HTTP status code
    const statusEvent = new CustomEvent('httpStatus', { 
      detail: 404,
      bubbles: true,
      cancelable: true 
    });
    window.dispatchEvent(statusEvent);

    // Ensure Netlify sees this is a 404 page
    if (typeof window !== 'undefined') {
      // Add a meta tag that Netlify can use
      const meta = document.createElement('meta');
      meta.name = 'netlify:status';
      meta.content = '404';
      document.head.appendChild(meta);
      
      // Handle Netlify Identity if present
      if (window.netlifyIdentity) {
        window.netlifyIdentity.on('error', err => console.error('Netlify Identity error:', err));
      }
    }

    // Log for debugging
    console.log('404 NotFoundBoundary mounted, status set');
  }, []);
  
  return (
    <>
      <Helmet>
        <title>Error, Page Not Fount</title>
        <link rel="canonical" href="https://seo-vacancy.eu/error" />
        <meta name="robots" content="noindex" />
        <meta httpEquiv="Status" content="404" />
        <meta httpEquiv="status" content="404" />
        <meta name="netlify:status" content="404" />
      </Helmet>
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
        <a href="/" className="text-blue-500 hover:underline">Return to homepage</a>
      </div>
    </>
  );
};

export default NotFoundBoundary;
