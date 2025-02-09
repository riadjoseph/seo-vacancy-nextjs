import { useEffect } from "react";
import { Helmet } from "react-helmet";

const NotFoundBoundary = () => {
  useEffect(() => {
    fetch("/api/status", { headers: { "x-status": "404" } });
  }, []);

  return (
    <>
      <Helmet>
        <title>404 - Page Not Found</title>
        <meta httpEquiv="Status" content="404" />
      </Helmet>
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
        <a href="/" className="text-blue-500 hover:underline">Return to homepage</a>
      </div>
    </>
  );
};

export default NotFoundBoundary;