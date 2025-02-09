import { useEffect } from "react";
import { Helmet } from "react-helmet";

const NotFoundBoundary = () => {
  useEffect(() => {
    // Set status code for Netlify
    const statusEvent = new CustomEvent('httpStatus', { detail: 404 });
    window.dispatchEvent(statusEvent);
  }, []);

  return (
    <>
      <Helmet>
        <title>Page Not Found | Job Board</title>
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