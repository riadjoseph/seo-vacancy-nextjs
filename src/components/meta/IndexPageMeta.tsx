import { Helmet } from "react-helmet";
import { useSearchParams } from "react-router-dom";

const IndexPageMeta = () => {
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  
  const pageTitle = currentPage === 1
    ? "EU SEO Jobs - Latest Opportunities"
    : `EU SEO Jobs - Page ${currentPage}`;
    
  const pageDescription = currentPage === 1
    ? "Browse the latest SEO job opportunities across Europe. Remote positions, in-house roles, and agency vacancies for SEO professionals."
    : `Browse the latest SEO job opportunities across Europe - Page ${currentPage}. Remote positions, in-house roles, and agency vacancies for SEO professionals.`;
    
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
    </Helmet>
  );
};

export default IndexPageMeta;