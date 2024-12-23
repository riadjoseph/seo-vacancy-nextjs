import { Helmet } from "react-helmet";
import { useSearchParams } from "react-router-dom";

const IndexPageMeta = () => {
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  
  const pageTitle = "SEO Job Board - Find Your Next SEO Career Opportunity";
  const pageDescription = "Browse the latest SEO job opportunities across Europe. Remote positions, in-house roles, and agency vacancies for SEO professionals.";
  const currentUrl = currentPage === 1 
    ? `${window.location.origin}/` 
    : `${window.location.origin}/?page=${currentPage}`;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <link rel="canonical" href={currentUrl} />
      <meta name="description" content={pageDescription} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={currentUrl} />
      {currentPage > 1 && <meta name="robots" content="noindex" />}
    </Helmet>
  );
};

export default IndexPageMeta;