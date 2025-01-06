import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <Helmet>
        <title>404 - Page Not Found | SEO Job Board</title>
        <meta name="robots" content="noindex" />
        <meta httpEquiv="Status" content="404" />
      </Helmet>

      <div className="text-center space-y-6">
        {/* Optional: Add a 404 illustration or icon here */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Page Not Found</h1>
          <p className="text-xl text-gray-600">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Browse All Jobs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 