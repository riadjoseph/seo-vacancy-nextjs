import { useEffect } from "react";
import { useRouteError } from "react-router-dom";
import { Helmet } from "react-helmet";

const NotFoundBoundary = () => {
  const error = useRouteError();
  
  useEffect(() => {
    // Set the status code at the document level
    document.documentElement.dataset.status = "404";
    
    // Create and dispatch a custom event to set the HTTP status code
    const statusEvent = new CustomEvent('httpStatus', { detail: 404 });
    window.dispatchEvent(statusEvent);
  }, []);
  
  return (
    <>
      <Helmet>
        <title>Not Found | Job Board</title>
        <meta name="robots" content="noindex" />
        <meta httpEquiv="Status" content="404" />
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