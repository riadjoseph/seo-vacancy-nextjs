import { useEffect } from "react";
import { useRouteError } from "react-router-dom";
import { Helmet } from "react-helmet";

const NotFoundBoundary = () => {
  useEffect(() => {
    // Set status code for Netlify
    const meta = document.createElement('meta');
    meta.name = 'netlify:status';
    meta.content = '404';
    document.head.appendChild(meta);
    
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Page Not Found | Job Board</title>
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