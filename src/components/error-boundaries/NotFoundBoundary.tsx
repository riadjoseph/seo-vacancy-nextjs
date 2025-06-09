// Improved NotFoundBoundary.tsx with bot-specific handling
import { useEffect, useState } from "react";
import { useRouteError } from "react-router-dom";
import { Helmet } from "react-helmet";

const NotFoundBoundary = () => {
  const error = useRouteError();
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  
  // Detect if this might be a bot
  const detectBot = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const botPatterns = [
      // Search engine bots
      'adsbot', 'applebot', 'baiduspider', 'googlebot', 'mediapartners-google',
      'yandex', 'yandexbot', 'bingbot', 'naver', 'baidu', 'bing', 'google',
      
      // AI/LLM bots
      'gptbot', 'amazonbot', 'anthropic', 'bytespider', 'ccbot', 'chatgpt',
      'claudebot', 'claude', 'oai-searchbot', 'perplexity', 'youbot',
      
      // Social media bots
      'facebook', 'facebookexternalhit', 'meta-external', 'twitterbot', 'linkedinbot',
      
      // Other common crawlers
      'slurp', 'duckduckbot', 'crawler', 'spider', 'whatsapp', 'telegram'
    ];
    return botPatterns.some(pattern => userAgent.includes(pattern));
  };

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

    // For job pages that might have failed due to timing issues
    const isJobPage = window.location.pathname.startsWith('/job/');
    const isBot = detectBot();
    
    if (isJobPage && !isBot && retryAttempts < 2) {
      // Retry for human users on job pages (might be timing issue)
      setIsRetrying(true);
      setRetryAttempts(prev => prev + 1);
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
      return;
    }

    // Enhanced meta tag for Netlify
    const meta = document.createElement('meta');
    meta.name = 'netlify:status';
    meta.content = '404';
    document.head.appendChild(meta);

    // Log for debugging - include user agent info
    console.log('404 NotFoundBoundary mounted', {
      path: window.location.pathname,
      userAgent: navigator.userAgent,
      isBot: isBot,
      retryAttempts: retryAttempts
    });
  }, [retryAttempts]);

  if (isRetrying) {
    return (
      <div className="container mx-auto py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading job details...</p>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Page Not Found | Job Board</title>
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
            Return to homepage
          </a>
          <a href="/jobs" className="text-blue-500 hover:underline block">
            Browse all jobs
          </a>
        </div>
        
        {/* Debug info for development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded text-left text-sm">
            <strong>Debug Info:</strong><br />
            Path: {window.location.pathname}<br />
            User Agent: {navigator.userAgent}<br />
            Retry Attempts: {retryAttempts}
          </div>
        )}
      </div>
    </>
  );
};

export default NotFoundBoundary;